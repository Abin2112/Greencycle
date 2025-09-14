import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import QRCode from "qrcode";
import { query, transaction } from "../config/database.js";
import { authenticateToken, userOnly, ngoOnly, adminOnly } from "../middleware/auth.js";
import googleVisionService from "../services/googleVision.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/devices/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'device-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Generate QR code
const generateQRCode = async (deviceId) => {
  try {
    const qrData = {
      deviceId: deviceId,
      timestamp: new Date().toISOString(),
      platform: 'GreenCycle'
    };
    
    const qrString = await QRCode.toDataURL(JSON.stringify(qrData));
    return qrString;
  } catch (error) {
    console.error('QR Code generation error:', error);
    return null;
  }
};

// AI Device Recognition Mock (replace with actual AI service)
const recognizeDevice = async (imageUrl) => {
  // Mock AI recognition - replace with actual TensorFlow Lite/Teachable Machine integration
  const deviceTypes = ['smartphone', 'laptop', 'desktop', 'tablet', 'smartwatch', 'headphones'];
  const randomType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
  
  return {
    device_type: randomType,
    confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
    brand: 'Unknown',
    model: 'Unknown'
  };
};

// OCR Processing Mock (replace with Google Vision API)
const processOCR = async (imageUrl) => {
  // Mock OCR - replace with actual Google Vision API integration
  return {
    serial_number: 'SN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    model_number: 'MDL' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    text_extracted: ['Sample extracted text', 'Model information', 'Serial number data']
  };
};

// Device Valuation Algorithm
const calculateDeviceValue = async (device_type, condition, age_years = 2) => {
  try {
    // Get base values from eco_impact_formulas
    const formula = await query(
      'SELECT points_per_kg FROM eco_impact_formulas WHERE device_type = $1',
      [device_type]
    );

    let baseValue = formula.rows.length > 0 ? formula.rows[0].points_per_kg * 10 : 100;

    // Condition multipliers
    const conditionMultipliers = {
      'excellent': 1.0,
      'good': 0.8,
      'fair': 0.6,
      'poor': 0.4,
      'broken': 0.2
    };

    // Age depreciation
    const ageMultiplier = Math.max(0.2, 1 - (age_years * 0.15));

    const estimatedValue = baseValue * (conditionMultipliers[condition] || 0.5) * ageMultiplier;

    // Determine recommendation
    let recommendation = 'recycle';
    if (estimatedValue > 200 && condition !== 'broken') {
      recommendation = 'resell';
    } else if (estimatedValue > 100 && ['excellent', 'good'].includes(condition)) {
      recommendation = 'donate';
    } else if (condition === 'broken' || estimatedValue < 50) {
      recommendation = 'recycle';
    } else {
      recommendation = 'repair';
    }

    return {
      estimated_value: Math.round(estimatedValue),
      recommendation: recommendation
    };
  } catch (error) {
    console.error('Valuation error:', error);
    return { estimated_value: 50, recommendation: 'recycle' };
  }
};

// Upload device with images
router.post("/upload", authenticateToken, userOnly, upload.array('images', 5), async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      device_type,
      brand,
      model,
      serial_number,
      condition,
      weight_kg,
      description,
      pickup_address,
      pickup_instructions
    } = req.body;

    if (!device_type || !condition) {
      return res.status(400).json({
        success: false,
        message: "Device type and condition are required"
      });
    }

    // Process uploaded images
    const imageUrls = req.files ? req.files.map(file => `/uploads/devices/${file.filename}`) : [];

    // AI Device Recognition using Google Vision API
    let aiData = null;
    let ocrData = null;
    
    if (req.files && req.files.length > 0) {
      try {
        // Use the first uploaded image for AI analysis
        const imageBuffer = req.files[0].buffer || require('fs').readFileSync(req.files[0].path);
        
        // Google Vision AI Device Recognition
        aiData = await googleVisionService.recognizeDevice(imageBuffer);
        
        // Google Vision OCR Processing
        ocrData = await googleVisionService.extractText(imageBuffer);
        
        console.log('AI Recognition Result:', aiData);
        console.log('OCR Result:', ocrData);
        
      } catch (error) {
        console.error('AI/OCR processing error:', error);
        // Continue with user-provided data if AI fails
      }
    }

    // Calculate device valuation
    const finalDeviceType = aiData?.deviceType || device_type;
    const finalCondition = aiData?.condition || condition;
    const valuation = await calculateDeviceValue(finalDeviceType, finalCondition);

    // Create device record
    const deviceResult = await query(
      `INSERT INTO devices (
        user_id, device_type, brand, model, serial_number, condition, weight_kg,
        estimated_value, recommendation, image_urls, ai_confidence_score, ocr_data,
        description, pickup_address, pickup_instructions, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, device_type, estimated_value, recommendation, status, created_at`,
      [
        userId,
        finalDeviceType,
        aiData?.suggestedBrand || brand,
        aiData?.detectedLabels?.[0]?.description || model,
        ocrData?.extractedInfo?.serialNumber || serial_number,
        finalCondition,
        weight_kg,
        aiData?.estimatedValue || valuation.estimated_value,
        valuation.recommendation,
        imageUrls,
        aiData?.confidence || 0,
        JSON.stringify(ocrData || {}),
        description,
        pickup_address,
        pickup_instructions,
        'uploaded'
      ]
    );

    const device = deviceResult.rows[0];

    // Generate QR code
    const qrCode = await generateQRCode(device.id);
    if (qrCode) {
      await query(
        'UPDATE devices SET qr_code = $1 WHERE id = $2',
        [qrCode, device.id]
      );
      device.qr_code = qrCode;
    }

    res.status(201).json({
      success: true,
      message: "Device uploaded successfully with AI analysis",
      data: {
        device: device,
        ai_analysis: {
          device_recognition: aiData,
          text_extraction: ocrData,
          confidence_score: aiData?.confidence || 0,
          detected_device_type: aiData?.deviceType,
          suggested_brand: aiData?.suggestedBrand,
          assessed_condition: aiData?.condition,
          hazardous_materials: aiData?.hazardousMaterials || [],
          recyclable_components: aiData?.recyclableComponents || []
        },
        valuation: {
          estimated_value: aiData?.estimatedValue || valuation.estimated_value,
          recommendation: valuation.recommendation,
          confidence: aiData?.confidence || 0.5
        },
        environmental_impact: {
          recyclable: true,
          components: aiData?.recyclableComponents || [],
          hazardous_materials: aiData?.hazardousMaterials || []
        }
      }
    });

  } catch (error) {
    console.error('Device upload error:', error);
    res.status(500).json({
      success: false,
      message: "Device upload failed",
      error: error.message
    });
  }
});

// Get user's devices
router.get("/my-devices", authenticateToken, userOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE user_id = $1';
    let params = [userId];

    if (status) {
      whereClause += ' AND status = $2';
      params.push(status);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        id, device_type, brand, model, condition, weight_kg,
        estimated_value, recommendation, status, image_urls,
        qr_code, description, created_at, updated_at
      FROM devices 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM devices ${whereClause}`,
      params
    );

    res.json({
      success: true,
      devices: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch devices",
      error: error.message
    });
  }
});

// Get device details
router.get("/:deviceId", authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClause = 'WHERE d.id = $1';
    let params = [deviceId];

    // Users can only see their own devices, NGOs and admins can see devices assigned to them
    if (userRole === 'user') {
      whereClause += ' AND d.user_id = $2';
      params.push(userId);
    } else if (userRole === 'ngo') {
      // NGO can see devices assigned to them or unassigned devices in their area
      whereClause += ' AND (d.ngo_id = (SELECT id FROM ngos WHERE user_id = $2) OR d.ngo_id IS NULL)';
      params.push(userId);
    }

    const result = await query(
      `SELECT 
        d.*,
        u.name as user_name,
        u.email as user_email,
        n.name as ngo_name
      FROM devices d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN ngos n ON d.ngo_id = n.id
      ${whereClause}`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    res.json({
      success: true,
      device: result.rows[0]
    });

  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch device",
      error: error.message
    });
  }
});

// Update device status (NGO/Admin only)
router.put("/:deviceId/status", authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const allowedStatuses = [
      'uploaded', 'pickup_scheduled', 'picked_up', 'received', 
      'processing', 'refurbished', 'donated', 'recycled', 'disposed'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    // Verify device access
    let device;
    if (userRole === 'ngo') {
      const result = await query(
        'SELECT * FROM devices WHERE id = $1 AND ngo_id = (SELECT id FROM ngos WHERE user_id = $2)',
        [deviceId, userId]
      );
      device = result.rows[0];
    } else if (userRole === 'admin') {
      const result = await query('SELECT * FROM devices WHERE id = $1', [deviceId]);
      device = result.rows[0];
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update device status"
      });
    }

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found or access denied"
      });
    }

    // Update device status
    const updateResult = await query(
      `UPDATE devices 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, device_type, status, updated_at`,
      [status, deviceId]
    );

    // If device is recycled/donated, calculate impact
    if (['recycled', 'donated'].includes(status) && device.weight_kg) {
      await calculateAndRecordImpact(device.user_id, deviceId, device.device_type, device.weight_kg);
    }

    res.json({
      success: true,
      message: "Device status updated successfully",
      device: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Update device status error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update device status",
      error: error.message
    });
  }
});

// Calculate and record environmental impact
const calculateAndRecordImpact = async (userId, deviceId, deviceType, weightKg) => {
  try {
    // Get eco impact formula
    const formula = await query(
      'SELECT * FROM eco_impact_formulas WHERE device_type = $1',
      [deviceType]
    );

    if (formula.rows.length === 0) {
      console.warn(`No eco formula found for device type: ${deviceType}`);
      return;
    }

    const eco = formula.rows[0];
    const weight = parseFloat(weightKg) || 1.0;

    const waterSaved = eco.water_saved_per_kg * weight;
    const co2Saved = eco.co2_saved_per_kg * weight;
    const toxicPrevented = eco.toxic_waste_prevented_per_kg * weight;
    const pointsAwarded = eco.points_per_kg * weight;

    // Record impact report
    await query(
      `INSERT INTO impact_reports 
       (user_id, device_id, water_saved_liters, co2_saved_kg, toxic_waste_prevented_kg, points_awarded)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, deviceId, waterSaved, co2Saved, toxicPrevented, pointsAwarded]
    );

    // Update user points
    await query(
      'UPDATE users SET points = points + $1 WHERE id = $2',
      [pointsAwarded, userId]
    );

    console.log(`Impact recorded for device ${deviceId}: ${waterSaved}L water, ${co2Saved}kg CO2, ${pointsAwarded} points`);

  } catch (error) {
    console.error('Impact calculation error:', error);
  }
};

// Get devices for NGO (NGO dashboard)
router.get("/ngo/assigned", authenticateToken, ngoOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE d.ngo_id = (SELECT id FROM ngos WHERE user_id = $1)';
    let params = [userId];

    if (status) {
      whereClause += ' AND d.status = $2';
      params.push(status);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        d.*,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone
      FROM devices d
      LEFT JOIN users u ON d.user_id = u.id
      ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    res.json({
      success: true,
      devices: result.rows
    });

  } catch (error) {
    console.error('Get NGO devices error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned devices",
      error: error.message
    });
  }
});

// Admin: Get all devices
router.get("/admin/all", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { status, device_type, page = 1, limit = 20 } = req.query;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (status) {
      whereClause += ' AND d.status = $' + (params.length + 1);
      params.push(status);
    }

    if (device_type) {
      whereClause += ' AND d.device_type = $' + (params.length + 1);
      params.push(device_type);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        d.*,
        u.name as user_name,
        u.email as user_email,
        n.name as ngo_name
      FROM devices d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN ngos n ON d.ngo_id = n.id
      ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM devices d ${whereClause}`,
      params
    );

    res.json({
      success: true,
      devices: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get all devices error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch devices",
      error: error.message
    });
  }
});

// Delete device (User/Admin only)
router.delete("/:deviceId", authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClause = 'WHERE id = $1';
    let params = [deviceId];

    // Users can only delete their own devices, admins can delete any
    if (userRole === 'user') {
      whereClause += ' AND user_id = $2';
      params.push(userId);
    } else if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete device"
      });
    }

    const result = await query(
      `DELETE FROM devices ${whereClause} RETURNING id`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found or access denied"
      });
    }

    res.json({
      success: true,
      message: "Device deleted successfully"
    });

  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete device",
      error: error.message
    });
  }
});

export default router;