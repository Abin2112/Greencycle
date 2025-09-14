import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query, transaction } from "../config/database.js";
import { authenticateToken, adminOnly, ngoOnly } from "../middleware/auth.js";
import pool from "../config/database.js";

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Admin login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Check if credentials match environment variables
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Get or create admin user in database
      let adminResult = await query(
        'SELECT id, email, name, role FROM users WHERE email = $1 AND role = $2',
        [email, 'admin']
      );

      let adminUser;
      if (adminResult.rows.length === 0) {
        // Create admin user if doesn't exist
        const createResult = await query(
          `INSERT INTO users (email, name, role, is_active, email_verified, points, level) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, name, role`,
          [email, process.env.ADMIN_NAME || 'Admin', 'admin', true, true, 1000, 10]
        );
        adminUser = createResult.rows[0];
      } else {
        adminUser = adminResult.rows[0];
      }

      const token = generateToken(adminUser);

      res.json({
        success: true,
        message: "Admin login successful",
        user: adminUser,
        token
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
});

// User registration (Firebase + local DB)
router.post("/register", async (req, res) => {
  try {
    const { firebase_uid, email, name, phone, address, role = 'user' } = req.body;

    if (!firebase_uid || !email || !name) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID, email and name are required"
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE firebase_uid = $1 OR email = $2',
      [firebase_uid, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new user
    const result = await query(
      `INSERT INTO users (firebase_uid, email, name, phone, address, role, is_active, email_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, firebase_uid, email, name, phone, address, role, points, level, created_at`,
      [firebase_uid, email, name, phone, address, role, true, true]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
});

// User login (Firebase + local DB)
router.post("/login", async (req, res) => {
  try {
    const { firebase_uid, email } = req.body;

    if (!firebase_uid && !email) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID or email is required"
      });
    }

    // Find user by Firebase UID or email
    const queryText = firebase_uid 
      ? 'SELECT id, firebase_uid, email, name, phone, address, role, points, level FROM users WHERE firebase_uid = $1 AND is_active = true'
      : 'SELECT id, firebase_uid, email, name, phone, address, role, points, level FROM users WHERE email = $1 AND is_active = true';
    
    const result = await query(queryText, [firebase_uid || email]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.rows[0];
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
});

// NGO registration
router.post("/ngo/register", async (req, res) => {
  try {
    const { 
      firebase_uid, email, name, phone, 
      ngo_name, registration_number, address, 
      latitude, longitude, city, state, postal_code,
      contact_person, contact_email, contact_phone,
      website_url, services, operating_hours,
      license_document_url
    } = req.body;

    if (!firebase_uid || !email || !name || !ngo_name || !registration_number) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create user account
      const userResult = await client.query(
        `INSERT INTO users (firebase_uid, email, name, phone, role, is_active, email_verified) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id`,
        [firebase_uid, email, name, phone, 'ngo', true, true]
      );

      const userId = userResult.rows[0].id;

      // Create NGO profile
      const ngoResult = await client.query(
        `INSERT INTO ngos (
          user_id, name, registration_number, address, latitude, longitude, 
          city, state, postal_code, contact_person, contact_email, contact_phone,
          website_url, services, operating_hours, license_document_url, verification_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
        RETURNING id`,
        [
          userId, ngo_name, registration_number, address, latitude, longitude,
          city, state, postal_code, contact_person, contact_email, contact_phone,
          website_url, services, operating_hours, license_document_url, 'pending'
        ]
      );

      await client.query('COMMIT');

      // Get complete user data
      const completeUser = await query(
        `SELECT u.*, n.name as ngo_name, n.verification_status 
         FROM users u 
         LEFT JOIN ngos n ON u.id = n.user_id 
         WHERE u.id = $1`,
        [userId]
      );

      const user = completeUser.rows[0];
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: "NGO registration successful. Verification pending.",
        user,
        token
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('NGO registration error:', error);
    res.status(500).json({
      success: false,
      message: "NGO registration failed",
      error: error.message
    });
  }
});

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT u.*, n.name as ngo_name, n.verification_status, n.rating as ngo_rating
       FROM users u 
       LEFT JOIN ngos n ON u.id = n.user_id 
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message
    });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, profile_image_url } = req.body;

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           phone = COALESCE($2, phone), 
           address = COALESCE($3, address), 
           profile_image_url = COALESCE($4, profile_image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING id, email, name, phone, address, profile_image_url, role, points, level`,
      [name, phone, address, profile_image_url, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
});

// Logout (client-side token removal)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Logout successful"
  });
});

// Token verification
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user
  });
});

export default router;