import express from "express";
import { query } from "../config/database.js";
import { authenticateToken, userOnly, ngoOnly, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Get all verified NGOs
router.get("/", async (req, res) => {
  try {
    const { city, services, latitude, longitude, radius = 50, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE n.verification_status = $1 AND n.is_active = $2';
    let params = ['verified', true];

    if (city) {
      whereClause += ' AND LOWER(n.city) LIKE LOWER($' + (params.length + 1) + ')';
      params.push(`%${city}%`);
    }

    if (services) {
      whereClause += ' AND $' + (params.length + 1) + ' = ANY(n.services)';
      params.push(services);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        n.id, n.name, n.address, n.latitude, n.longitude, n.city, n.state,
        n.contact_person, n.contact_email, n.contact_phone, n.website_url,
        n.services, n.operating_hours, n.capacity_per_day, n.rating, n.total_reviews,
        u.name as contact_name
      FROM ngos n
      LEFT JOIN users u ON n.user_id = u.id
      ${whereClause}
      ORDER BY n.rating DESC, n.name ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    let ngos = result.rows;

    // Calculate distances if user location provided
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLon = parseFloat(longitude);
      const radiusKm = parseFloat(radius);

      ngos = ngos
        .map(ngo => ({
          ...ngo,
          distance: ngo.latitude && ngo.longitude 
            ? calculateDistance(userLat, userLon, parseFloat(ngo.latitude), parseFloat(ngo.longitude))
            : null
        }))
        .filter(ngo => !ngo.distance || ngo.distance <= radiusKm)
        .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    res.json({
      success: true,
      ngos: ngos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: ngos.length
      }
    });

  } catch (error) {
    console.error('Get NGOs error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGOs",
      error: error.message
    });
  }
});

// Get NGO details
router.get("/:ngoId", async (req, res) => {
  try {
    const { ngoId } = req.params;

    const result = await query(
      `SELECT 
        n.*,
        u.name as contact_name,
        u.email as contact_email,
        u.phone as contact_phone
      FROM ngos n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.id = $1 AND n.verification_status = $2 AND n.is_active = $3`,
      [ngoId, 'verified', true]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "NGO not found"
      });
    }

    const ngo = result.rows[0];

    // Get recent reviews/ratings (mock data for now)
    const reviews = [
      {
        id: 1,
        user_name: "John Doe",
        rating: 5,
        comment: "Excellent service! Quick pickup and professional handling.",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        user_name: "Jane Smith", 
        rating: 4,
        comment: "Good service, could improve communication.",
        created_at: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      ngo: ngo,
      reviews: reviews
    });

  } catch (error) {
    console.error('Get NGO details error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO details",
      error: error.message
    });
  }
});

// Find nearest NGOs
router.post("/nearest", async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, services, limit = 10 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    let whereClause = 'WHERE n.verification_status = $1 AND n.is_active = $2 AND n.latitude IS NOT NULL AND n.longitude IS NOT NULL';
    let params = ['verified', true];

    if (services && services.length > 0) {
      whereClause += ' AND n.services && $' + (params.length + 1);
      params.push(services);
    }

    const result = await query(
      `SELECT 
        n.id, n.name, n.address, n.latitude, n.longitude, n.city, n.state,
        n.contact_person, n.contact_email, n.contact_phone, n.website_url,
        n.services, n.operating_hours, n.capacity_per_day, n.rating, n.total_reviews
      FROM ngos n
      ${whereClause}
      ORDER BY n.rating DESC`,
      params
    );

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const radiusKm = parseFloat(radius);

    // Calculate distances and filter by radius
    const nearbyNgos = result.rows
      .map(ngo => ({
        ...ngo,
        distance: calculateDistance(userLat, userLon, parseFloat(ngo.latitude), parseFloat(ngo.longitude))
      }))
      .filter(ngo => ngo.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    res.json({
      success: true,
      message: `Found ${nearbyNgos.length} NGOs within ${radius}km`,
      ngos: nearbyNgos,
      search_criteria: {
        latitude,
        longitude,
        radius: radiusKm,
        services: services || []
      }
    });

  } catch (error) {
    console.error('Find nearest NGOs error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to find nearby NGOs",
      error: error.message
    });
  }
});

// Get NGO profile (for logged-in NGO)
router.get("/profile/me", authenticateToken, ngoOnly, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
        n.*,
        u.name as contact_name,
        u.email as contact_email,
        u.phone as contact_phone,
        u.created_at as user_created_at
      FROM ngos n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "NGO profile not found"
      });
    }

    const ngo = result.rows[0];

    // Get NGO statistics
    const statsResult = await query(
      `SELECT 
        COUNT(d.id) as total_devices,
        COUNT(CASE WHEN d.status = 'received' THEN 1 END) as devices_received,
        COUNT(CASE WHEN d.status IN ('recycled', 'donated') THEN 1 END) as devices_processed,
        COALESCE(SUM(d.weight_kg), 0) as total_weight,
        COUNT(DISTINCT p.id) as total_pickups,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_pickups
      FROM devices d
      LEFT JOIN pickups p ON d.id = ANY(SELECT device_id FROM pickup_devices WHERE pickup_id = p.id)
      WHERE d.ngo_id = $1`,
      [ngo.id]
    );

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      ngo: ngo,
      statistics: {
        total_devices: parseInt(stats.total_devices),
        devices_received: parseInt(stats.devices_received),
        devices_processed: parseInt(stats.devices_processed),
        total_weight_kg: parseFloat(stats.total_weight),
        total_pickups: parseInt(stats.total_pickups),
        completed_pickups: parseInt(stats.completed_pickups)
      }
    });

  } catch (error) {
    console.error('Get NGO profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO profile",
      error: error.message
    });
  }
});

// Update NGO profile
router.put("/profile/me", authenticateToken, ngoOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name, address, latitude, longitude, city, state, postal_code,
      contact_person, contact_email, contact_phone, website_url,
      services, operating_hours, capacity_per_day
    } = req.body;

    // Verify NGO exists
    const ngoResult = await query(
      'SELECT id FROM ngos WHERE user_id = $1',
      [userId]
    );

    if (ngoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "NGO profile not found"
      });
    }

    const ngoId = ngoResult.rows[0].id;

    // Update NGO profile
    const updateResult = await query(
      `UPDATE ngos SET 
        name = COALESCE($1, name),
        address = COALESCE($2, address),
        latitude = COALESCE($3, latitude),
        longitude = COALESCE($4, longitude),
        city = COALESCE($5, city),
        state = COALESCE($6, state),
        postal_code = COALESCE($7, postal_code),
        contact_person = COALESCE($8, contact_person),
        contact_email = COALESCE($9, contact_email),
        contact_phone = COALESCE($10, contact_phone),
        website_url = COALESCE($11, website_url),
        services = COALESCE($12, services),
        operating_hours = COALESCE($13, operating_hours),
        capacity_per_day = COALESCE($14, capacity_per_day),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *`,
      [
        name, address, latitude, longitude, city, state, postal_code,
        contact_person, contact_email, contact_phone, website_url,
        services, operating_hours, capacity_per_day, ngoId
      ]
    );

    res.json({
      success: true,
      message: "NGO profile updated successfully",
      ngo: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Update NGO profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update NGO profile",
      error: error.message
    });
  }
});

// Admin: Get all NGOs (including pending)
router.get("/admin/all", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { verification_status, city, page = 1, limit = 20 } = req.query;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (verification_status) {
      whereClause += ' AND n.verification_status = $' + (params.length + 1);
      params.push(verification_status);
    }

    if (city) {
      whereClause += ' AND LOWER(n.city) LIKE LOWER($' + (params.length + 1) + ')';
      params.push(`%${city}%`);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        n.*,
        u.name as contact_name,
        u.email as contact_email,
        u.phone as contact_phone,
        u.created_at as user_created_at
      FROM ngos n
      LEFT JOIN users u ON n.user_id = u.id
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM ngos n ${whereClause}`,
      params
    );

    res.json({
      success: true,
      ngos: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get all NGOs error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGOs",
      error: error.message
    });
  }
});

// Admin: Update NGO verification status
router.put("/admin/:ngoId/verification", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { ngoId } = req.params;
    const { verification_status, admin_notes } = req.body;

    const allowedStatuses = ['pending', 'verified', 'rejected'];
    if (!allowedStatuses.includes(verification_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status"
      });
    }

    const result = await query(
      `UPDATE ngos 
       SET verification_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, verification_status`,
      [verification_status, ngoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "NGO not found"
      });
    }

    // TODO: Send notification email to NGO about verification status

    res.json({
      success: true,
      message: `NGO verification status updated to ${verification_status}`,
      ngo: result.rows[0]
    });

  } catch (error) {
    console.error('Update verification status error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update verification status",
      error: error.message
    });
  }
});

// Admin: Delete NGO
router.delete("/admin/:ngoId", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { ngoId } = req.params;

    // Check if NGO has active devices or pickups
    const activeResult = await query(
      `SELECT 
        COUNT(d.id) as active_devices,
        COUNT(p.id) as active_pickups
      FROM ngos n
      LEFT JOIN devices d ON n.id = d.ngo_id AND d.status NOT IN ('recycled', 'donated', 'disposed')
      LEFT JOIN pickups p ON n.id = p.ngo_id AND p.status NOT IN ('completed', 'cancelled')
      WHERE n.id = $1`,
      [ngoId]
    );

    const active = activeResult.rows[0];
    if (parseInt(active.active_devices) > 0 || parseInt(active.active_pickups) > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete NGO with active devices or pickups"
      });
    }

    // Soft delete by deactivating
    const result = await query(
      `UPDATE ngos 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, name`,
      [ngoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "NGO not found"
      });
    }

    res.json({
      success: true,
      message: "NGO deactivated successfully",
      ngo: result.rows[0]
    });

  } catch (error) {
    console.error('Delete NGO error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete NGO",
      error: error.message
    });
  }
});

// Get NGO services/categories
router.get("/services/list", async (req, res) => {
  try {
    // Get unique services from all verified NGOs
    const result = await query(
      `SELECT DISTINCT unnest(services) as service
       FROM ngos 
       WHERE verification_status = 'verified' AND is_active = true
       ORDER BY service`
    );

    const services = result.rows.map(row => row.service);

    res.json({
      success: true,
      services: services
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message
    });
  }
});

export default router;