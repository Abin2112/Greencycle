import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

/** Helper: JWT generation */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/** REGISTER endpoint (users & NGOs only) */
app.post("/api/register", async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    website,
    registrationNumber,
    description,
    services,
    operatingAreas
  } = req.body;

  // prevent anyone from registering as admin
  if (role === "admin") {
    return res.status(403).json({ error: "Admin registration is not allowed" });
  }

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Insert into users table
    const result = await pool.query(
      `INSERT INTO users (name, email, role, points, badges, phone, address, created_at, updated_at)
       VALUES ($1, $2, $3, 0, ARRAY[]::text[], $4, $5, NOW(), NOW())
       RETURNING *`,
      [name, email, role || "user", phone, address]
    );

    const user = result.rows[0];

    // Insert password into auth_credentials
    await pool.query(
      `INSERT INTO auth_credentials (user_id, password_hash) VALUES ($1, $2)`,
      [user.id, hashed]
    );

    // If NGO, insert into ngos table
    if (role === "ngo") {
      await pool.query(
        `INSERT INTO ngos (user_id, name, description, address, registration_number, website, services, operating_areas, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [user.id, name, description, address, registrationNumber, website, services, operatingAreas]
      );
    }

    res.json({ message: "Registration successful", user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

/** LOGIN endpoint (users & NGOs) */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    const credResult = await pool.query("SELECT * FROM auth_credentials WHERE user_id = $1", [user.id]);
    if (credResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, credResult.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ADMIN LOGIN - predefined credentials only */
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({ token, role: "admin", email });
  }

  res.status(401).json({ error: "Invalid admin credentials" });
});

/** Middleware: Protect routes */
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

/** Example: Protected admin dashboard */
app.get("/api/admin-dashboard", authMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
