import express from "express";
import { authenticateToken, userOnly } from "../middleware/auth.js";

const router = express.Router();

// Get user's impact dashboard
router.get("/dashboard", authenticateToken, userOnly, (req, res) => {
  res.json({
    success: true,
    message: "Impact dashboard endpoint - coming soon",
    data: {
      devicesRecycled: 0,
      co2Saved: 0,
      pointsEarned: 0,
      badges: [],
      impact: {
        environmental: {},
        social: {}
      }
    }
  });
});

// Get global impact statistics
router.get("/global", (req, res) => {
  res.json({
    success: true,
    message: "Global impact endpoint - coming soon",
    data: {
      totalDevices: 0,
      totalUsers: 0,
      totalNGOs: 0,
      co2Saved: 0,
      materialsRecovered: {}
    }
  });
});

export default router;