import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Import database
import { testConnection } from "./config/database.js";
import { setupDatabaseSimple } from "./scripts/setupDb.js";

// Import routes
import authRoutes from "./routes/auth.js";
import deviceRoutes from "./routes/devices.js";
import ngoRoutes from "./routes/ngos.js";
import pickupRoutes from "./routes/pickups.js";
import impactRoutes from "./routes/impact.js";
import gamificationRoutes from "./routes/gamification.js";
import analyticsRoutes from "./routes/analytics.js";

// Import middleware
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "GreenCycle API Server",
    version: "1.0.0",
    endpoints: [
      "/api/auth",
      "/api/devices", 
      "/api/ngos",
      "/api/pickups",
      "/api/impact",
      "/api/gamification",
      "/api/analytics"
    ]
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    method: req.method,
    url: req.originalUrl
  });
});

const PORT = process.env.PORT || 3001;

// Start server with database initialization
const startServer = async () => {
  try {
    // Initialize database
    console.log('🔄 Setting up database...');
    await setupDatabaseSimple();
    
    app.listen(PORT, () => {
      console.log(`🚀 GreenCycle API Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: Connected and initialized`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;