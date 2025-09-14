import express from "express";
import { query, transaction } from "../config/database.js";
import { authenticateToken, userOnly, ngoOnly, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Schedule a pickup
router.post("/schedule", authenticateToken, userOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      device_ids,
      ngo_id,
      pickup_date,
      pickup_time_slot,
      pickup_address,
      pickup_instructions
    } = req.body;

    if (!device_ids || !Array.isArray(device_ids) || device_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one device ID is required"
      });
    }

    if (!ngo_id || !pickup_date || !pickup_address) {
      return res.status(400).json({
        success: false,
        message: "NGO ID, pickup date, and pickup address are required"
      });
    }

    // Verify all devices belong to the user and are eligible for pickup
    const deviceCheck = await query(
      `SELECT id, device_type, weight_kg, status 
       FROM devices 
       WHERE id = ANY($1) AND user_id = $2 AND status IN ('uploaded', 'pickup_scheduled')`,
      [device_ids, userId]
    );

    if (deviceCheck.rows.length !== device_ids.length) {
      return res.status(400).json({
        success: false,
        message: "Some devices are not found or not eligible for pickup"
      });
    }

    // Verify NGO exists and is verified
    const ngoCheck = await query(
      `SELECT id, name, capacity_per_day 
       FROM ngos 
       WHERE id = $1 AND verification_status = 'verified' AND is_active = true`,
      [ngo_id]
    );

    if (ngoCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "NGO not found or not verified"
      });
    }

    const ngo = ngoCheck.rows[0];

    // Check NGO capacity for the date
    const capacityCheck = await query(
      `SELECT COUNT(*) as scheduled_pickups
       FROM pickups 
       WHERE ngo_id = $1 AND pickup_date = $2 AND status NOT IN ('cancelled', 'completed')`,
      [ngo_id, pickup_date]
    );

    if (parseInt(capacityCheck.rows[0].scheduled_pickups) >= ngo.capacity_per_day) {
      return res.status(400).json({
        success: false,
        message: "NGO has reached capacity for this date. Please choose another date."
      });
    }

    // Calculate total weight and device count
    const totalWeight = deviceCheck.rows.reduce((sum, device) => 
      sum + (parseFloat(device.weight_kg) || 0), 0
    );

    // Use transaction to ensure data consistency
    const result = await transaction(async (client) => {
      // Create pickup record
      const pickupResult = await client.query(
        `INSERT INTO pickups (
          user_id, ngo_id, pickup_date, pickup_time_slot, pickup_address,
          pickup_instructions, total_devices, total_weight_kg, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, pickup_date, pickup_time_slot, status, created_at`,
        [
          userId, ngo_id, pickup_date, pickup_time_slot, pickup_address,
          pickup_instructions, device_ids.length, totalWeight, 'scheduled'
        ]
      );

      const pickup = pickupResult.rows[0];

      // Link devices to pickup
      for (const deviceId of device_ids) {
        await client.query(
          'INSERT INTO pickup_devices (pickup_id, device_id) VALUES ($1, $2)',
          [pickup.id, deviceId]
        );
      }

      // Update device statuses and assign NGO
      await client.query(
        `UPDATE devices 
         SET status = 'pickup_scheduled', ngo_id = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = ANY($2)`,
        [ngo_id, device_ids]
      );

      return pickup;
    });

    res.status(201).json({
      success: true,
      message: "Pickup scheduled successfully",
      pickup: {
        ...result,
        ngo_name: ngo.name,
        device_count: device_ids.length,
        total_weight_kg: totalWeight
      }
    });

  } catch (error) {
    console.error('Schedule pickup error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to schedule pickup",
      error: error.message
    });
  }
});

// Get user's pickups
router.get("/my-pickups", authenticateToken, userOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE p.user_id = $1';
    let params = [userId];

    if (status) {
      whereClause += ' AND p.status = $2';
      params.push(status);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        p.id, p.pickup_date, p.pickup_time_slot, p.pickup_address,
        p.status, p.total_devices, p.total_weight_kg, p.driver_name,
        p.driver_phone, p.estimated_arrival, p.actual_pickup_time,
        p.rating, p.feedback, p.created_at,
        n.name as ngo_name, n.contact_phone as ngo_phone,
        array_agg(d.device_type) as device_types
      FROM pickups p
      LEFT JOIN ngos n ON p.ngo_id = n.id
      LEFT JOIN pickup_devices pd ON p.id = pd.pickup_id
      LEFT JOIN devices d ON pd.device_id = d.id
      ${whereClause}
      GROUP BY p.id, n.name, n.contact_phone
      ORDER BY p.pickup_date DESC, p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    res.json({
      success: true,
      pickups: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.rows.length
      }
    });

  } catch (error) {
    console.error('Get user pickups error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickups",
      error: error.message
    });
  }
});

// Get pickup details
router.get("/:pickupId", authenticateToken, async (req, res) => {
  try {
    const { pickupId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClause = 'WHERE p.id = $1';
    let params = [pickupId];

    // Users can only see their own pickups, NGOs can see their assigned pickups
    if (userRole === 'user') {
      whereClause += ' AND p.user_id = $2';
      params.push(userId);
    } else if (userRole === 'ngo') {
      whereClause += ' AND p.ngo_id = (SELECT id FROM ngos WHERE user_id = $2)';
      params.push(userId);
    }

    const result = await query(
      `SELECT 
        p.*,
        u.name as user_name, u.email as user_email, u.phone as user_phone,
        n.name as ngo_name, n.contact_person as ngo_contact_person,
        n.contact_phone as ngo_contact_phone
      FROM pickups p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN ngos n ON p.ngo_id = n.id
      ${whereClause}`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found"
      });
    }

    const pickup = result.rows[0];

    // Get associated devices
    const devicesResult = await query(
      `SELECT d.id, d.device_type, d.brand, d.model, d.condition, 
              d.weight_kg, d.status, d.image_urls
       FROM devices d
       INNER JOIN pickup_devices pd ON d.id = pd.device_id
       WHERE pd.pickup_id = $1`,
      [pickupId]
    );

    pickup.devices = devicesResult.rows;

    res.json({
      success: true,
      pickup: pickup
    });

  } catch (error) {
    console.error('Get pickup details error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickup details",
      error: error.message
    });
  }
});

// Update pickup status (NGO only)
router.put("/:pickupId/status", authenticateToken, ngoOnly, async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { status, driver_name, driver_phone, vehicle_details, estimated_arrival, notes } = req.body;
    const userId = req.user.id;

    const allowedStatuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    // Verify pickup belongs to NGO
    const pickupCheck = await query(
      `SELECT p.id, p.status as current_status, p.user_id 
       FROM pickups p
       INNER JOIN ngos n ON p.ngo_id = n.id
       WHERE p.id = $1 AND n.user_id = $2`,
      [pickupId, userId]
    );

    if (pickupCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found or access denied"
      });
    }

    const pickup = pickupCheck.rows[0];

    // Prepare update fields
    let updateFields = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
    let updateParams = [status];
    let paramCount = 1;

    if (driver_name) {
      updateFields.push(`driver_name = $${++paramCount}`);
      updateParams.push(driver_name);
    }
    if (driver_phone) {
      updateFields.push(`driver_phone = $${++paramCount}`);
      updateParams.push(driver_phone);
    }
    if (vehicle_details) {
      updateFields.push(`vehicle_details = $${++paramCount}`);
      updateParams.push(vehicle_details);
    }
    if (estimated_arrival) {
      updateFields.push(`estimated_arrival = $${++paramCount}`);
      updateParams.push(estimated_arrival);
    }
    if (notes) {
      updateFields.push(`notes = $${++paramCount}`);
      updateParams.push(notes);
    }

    // If status is completed, set actual pickup time
    if (status === 'completed') {
      updateFields.push(`actual_pickup_time = CURRENT_TIMESTAMP`);
    }

    // Update pickup
    const updateResult = await query(
      `UPDATE pickups 
       SET ${updateFields.join(', ')}
       WHERE id = $${++paramCount}
       RETURNING id, status, driver_name, driver_phone, estimated_arrival, actual_pickup_time`,
      [...updateParams, pickupId]
    );

    // Update device statuses if pickup is completed
    if (status === 'completed') {
      await query(
        `UPDATE devices 
         SET status = 'picked_up', updated_at = CURRENT_TIMESTAMP
         WHERE id IN (
           SELECT device_id FROM pickup_devices WHERE pickup_id = $1
         )`,
        [pickupId]
      );
    }

    res.json({
      success: true,
      message: "Pickup status updated successfully",
      pickup: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Update pickup status error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update pickup status",
      error: error.message
    });
  }
});

// Get NGO pickups (NGO dashboard)
router.get("/ngo/assigned", authenticateToken, ngoOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, date, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE p.ngo_id = (SELECT id FROM ngos WHERE user_id = $1)';
    let params = [userId];

    if (status) {
      whereClause += ' AND p.status = $' + (params.length + 1);
      params.push(status);
    }

    if (date) {
      whereClause += ' AND p.pickup_date = $' + (params.length + 1);
      params.push(date);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        p.id, p.pickup_date, p.pickup_time_slot, p.pickup_address,
        p.pickup_instructions, p.status, p.total_devices, p.total_weight_kg,
        p.driver_name, p.driver_phone, p.estimated_arrival, p.created_at,
        u.name as user_name, u.email as user_email, u.phone as user_phone,
        array_agg(d.device_type) as device_types
      FROM pickups p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN pickup_devices pd ON p.id = pd.pickup_id
      LEFT JOIN devices d ON pd.device_id = d.id
      ${whereClause}
      GROUP BY p.id, u.name, u.email, u.phone
      ORDER BY p.pickup_date ASC, p.pickup_time_slot ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    res.json({
      success: true,
      pickups: result.rows
    });

  } catch (error) {
    console.error('Get NGO pickups error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO pickups",
      error: error.message
    });
  }
});

// Cancel pickup (User only)
router.put("/:pickupId/cancel", authenticateToken, userOnly, async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    // Verify pickup belongs to user and can be cancelled
    const pickupCheck = await query(
      `SELECT id, status FROM pickups 
       WHERE id = $1 AND user_id = $2 AND status IN ('scheduled', 'confirmed')`,
      [pickupId, userId]
    );

    if (pickupCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found or cannot be cancelled"
      });
    }

    // Use transaction to update pickup and devices
    await transaction(async (client) => {
      // Update pickup status
      await client.query(
        `UPDATE pickups 
         SET status = 'cancelled', notes = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [reason || 'Cancelled by user', pickupId]
      );

      // Reset device statuses
      await client.query(
        `UPDATE devices 
         SET status = 'uploaded', ngo_id = NULL, updated_at = CURRENT_TIMESTAMP
         WHERE id IN (
           SELECT device_id FROM pickup_devices WHERE pickup_id = $1
         )`,
        [pickupId]
      );
    });

    res.json({
      success: true,
      message: "Pickup cancelled successfully"
    });

  } catch (error) {
    console.error('Cancel pickup error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel pickup",
      error: error.message
    });
  }
});

// Rate pickup (User only)
router.post("/:pickupId/rate", authenticateToken, userOnly, async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Verify pickup belongs to user and is completed
    const pickupCheck = await query(
      `SELECT p.id, p.ngo_id, n.rating as current_rating, n.total_reviews
       FROM pickups p
       INNER JOIN ngos n ON p.ngo_id = n.id
       WHERE p.id = $1 AND p.user_id = $2 AND p.status = 'completed' AND p.rating IS NULL`,
      [pickupId, userId]
    );

    if (pickupCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found, not completed, or already rated"
      });
    }

    const pickup = pickupCheck.rows[0];

    // Use transaction to update pickup rating and NGO overall rating
    await transaction(async (client) => {
      // Update pickup with rating
      await client.query(
        `UPDATE pickups 
         SET rating = $1, feedback = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [rating, feedback, pickupId]
      );

      // Update NGO overall rating
      const currentRating = parseFloat(pickup.current_rating) || 0;
      const totalReviews = parseInt(pickup.total_reviews) || 0;
      
      const newTotalReviews = totalReviews + 1;
      const newRating = ((currentRating * totalReviews) + rating) / newTotalReviews;

      await client.query(
        `UPDATE ngos 
         SET rating = $1, total_reviews = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [newRating, newTotalReviews, pickup.ngo_id]
      );
    });

    res.json({
      success: true,
      message: "Pickup rated successfully"
    });

  } catch (error) {
    console.error('Rate pickup error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to rate pickup",
      error: error.message
    });
  }
});

// Admin: Get all pickups
router.get("/admin/all", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { status, ngo_id, user_id, date_from, date_to, page = 1, limit = 20 } = req.query;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (status) {
      whereClause += ' AND p.status = $' + (params.length + 1);
      params.push(status);
    }

    if (ngo_id) {
      whereClause += ' AND p.ngo_id = $' + (params.length + 1);
      params.push(ngo_id);
    }

    if (user_id) {
      whereClause += ' AND p.user_id = $' + (params.length + 1);
      params.push(user_id);
    }

    if (date_from) {
      whereClause += ' AND p.pickup_date >= $' + (params.length + 1);
      params.push(date_from);
    }

    if (date_to) {
      whereClause += ' AND p.pickup_date <= $' + (params.length + 1);
      params.push(date_to);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        p.*,
        u.name as user_name, u.email as user_email,
        n.name as ngo_name
      FROM pickups p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN ngos n ON p.ngo_id = n.id
      ${whereClause}
      ORDER BY p.pickup_date DESC, p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM pickups p ${whereClause}`,
      params
    );

    res.json({
      success: true,
      pickups: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get all pickups error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickups",
      error: error.message
    });
  }
});

export default router;