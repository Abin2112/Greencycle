import express from "express";
import { query } from "../config/database.js";
import { authenticateToken, adminOnly, ngoOnly } from "../middleware/auth.js";

const router = express.Router();

// Admin analytics endpoints
router.get("/admin/overview", authenticateToken, adminOnly, async (req, res) => {
  try {
    // Get comprehensive overview statistics
    const overviewResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user' AND is_active = true) as total_users,
        (SELECT COUNT(*) FROM ngos WHERE verification_status = 'verified' AND is_active = true) as total_ngos,
        (SELECT COUNT(*) FROM devices) as total_devices,
        (SELECT COUNT(*) FROM pickups) as total_pickups,
        (SELECT COUNT(*) FROM devices WHERE status IN ('recycled', 'donated')) as devices_processed,
        (SELECT COALESCE(SUM(weight_kg), 0) FROM devices WHERE status IN ('recycled', 'donated')) as total_weight_processed,
        (SELECT COALESCE(SUM(water_saved_liters), 0) FROM impact_reports) as total_water_saved,
        (SELECT COALESCE(SUM(co2_saved_kg), 0) FROM impact_reports) as total_co2_saved,
        (SELECT COALESCE(SUM(toxic_waste_prevented_kg), 0) FROM impact_reports) as total_toxic_prevented
    `);

    const overview = overviewResult.rows[0];

    // Monthly growth data
    const monthlyGrowthResult = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) FILTER (WHERE role = 'user') as new_users,
        COUNT(*) FILTER (WHERE role = 'ngo') as new_ngos
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    // Device processing trends
    const deviceTrendsResult = await query(`
      SELECT 
        DATE_TRUNC('month', updated_at) as month,
        COUNT(*) as devices_processed,
        device_type,
        COUNT(*) as count
      FROM devices 
      WHERE status IN ('recycled', 'donated') 
        AND updated_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', updated_at), device_type
      ORDER BY month, count DESC
    `);

    // Regional data
    const regionalResult = await query(`
      SELECT 
        n.city,
        n.state,
        COUNT(d.id) as devices_processed,
        COALESCE(SUM(d.weight_kg), 0) as total_weight,
        COUNT(DISTINCT n.id) as ngo_count
      FROM ngos n
      LEFT JOIN devices d ON n.id = d.ngo_id AND d.status IN ('recycled', 'donated')
      WHERE n.verification_status = 'verified' AND n.is_active = true
      GROUP BY n.city, n.state
      ORDER BY devices_processed DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        overview: {
          total_users: parseInt(overview.total_users),
          total_ngos: parseInt(overview.total_ngos),
          total_devices: parseInt(overview.total_devices),
          total_pickups: parseInt(overview.total_pickups),
          devices_processed: parseInt(overview.devices_processed),
          total_weight_processed: parseFloat(overview.total_weight_processed),
          environmental_impact: {
            water_saved_liters: parseFloat(overview.total_water_saved),
            co2_saved_kg: parseFloat(overview.total_co2_saved),
            toxic_waste_prevented_kg: parseFloat(overview.total_toxic_prevented)
          }
        },
        monthly_growth: monthlyGrowthResult.rows,
        device_trends: deviceTrendsResult.rows,
        regional_data: regionalResult.rows
      }
    });

  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin overview",
      error: error.message
    });
  }
});

router.get("/admin/users", authenticateToken, adminOnly, async (req, res) => {
  try {
    const userStatsResult = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_7d,
        AVG(points) as avg_points,
        COUNT(*) FILTER (WHERE points > 0) as active_users
      FROM users 
      WHERE role = 'user' AND is_active = true
    `);

    const userGrowthResult = await query(`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as new_users
      FROM users 
      WHERE role = 'user' AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `);

    const topUsersResult = await query(`
      SELECT 
        u.name,
        u.points,
        COUNT(d.id) as devices_uploaded,
        COALESCE(SUM(ir.water_saved_liters), 0) as water_saved,
        COALESCE(SUM(ir.co2_saved_kg), 0) as co2_saved
      FROM users u
      LEFT JOIN devices d ON u.id = d.user_id
      LEFT JOIN impact_reports ir ON u.id = ir.user_id
      WHERE u.role = 'user' AND u.is_active = true
      GROUP BY u.id, u.name, u.points
      ORDER BY u.points DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        stats: userStatsResult.rows[0],
        growth_chart: userGrowthResult.rows,
        top_users: topUsersResult.rows
      }
    });

  } catch (error) {
    console.error('Admin user analytics error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user analytics",
      error: error.message
    });
  }
});

router.get("/admin/ngos", authenticateToken, adminOnly, async (req, res) => {
  try {
    const ngoStatsResult = await query(`
      SELECT 
        COUNT(*) as total_ngos,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_ngos,
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_ngos,
        COUNT(*) FILTER (WHERE verification_status = 'rejected') as rejected_ngos,
        AVG(rating) as avg_rating,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_ngos_30d
      FROM ngos 
      WHERE is_active = true
    `);

    const ngoPerformanceResult = await query(`
      SELECT 
        n.name,
        n.rating,
        n.total_reviews,
        COUNT(d.id) as devices_processed,
        COUNT(p.id) as total_pickups,
        COALESCE(SUM(d.weight_kg), 0) as total_weight_processed
      FROM ngos n
      LEFT JOIN devices d ON n.id = d.ngo_id AND d.status IN ('recycled', 'donated')
      LEFT JOIN pickups p ON n.id = p.ngo_id AND p.status = 'completed'
      WHERE n.verification_status = 'verified' AND n.is_active = true
      GROUP BY n.id, n.name, n.rating, n.total_reviews
      ORDER BY devices_processed DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        stats: ngoStatsResult.rows[0],
        top_ngos: ngoPerformanceResult.rows
      }
    });

  } catch (error) {
    console.error('Admin NGO analytics error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO analytics",
      error: error.message
    });
  }
});

// NGO analytics endpoints
router.get("/ngo/overview", authenticateToken, ngoOnly, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get NGO ID
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

    const overviewResult = await query(`
      SELECT 
        COUNT(DISTINCT d.id) as total_devices,
        COUNT(DISTINCT d.user_id) as total_users_served,
        COUNT(DISTINCT p.id) as total_pickups,
        COUNT(*) FILTER (WHERE d.status IN ('recycled', 'donated')) as devices_processed,
        COUNT(*) FILTER (WHERE p.status = 'completed') as completed_pickups,
        COALESCE(SUM(d.weight_kg), 0) as total_weight,
        COALESCE(AVG(p.rating), 0) as avg_rating
      FROM devices d
      LEFT JOIN pickups p ON d.ngo_id = p.ngo_id
      WHERE d.ngo_id = $1
    `, [ngoId]);

    const monthlyStatsResult = await query(`
      SELECT 
        DATE_TRUNC('month', d.updated_at) as month,
        COUNT(*) FILTER (WHERE d.status IN ('recycled', 'donated')) as devices_processed,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'completed') as pickups_completed,
        COALESCE(SUM(d.weight_kg), 0) as weight_processed
      FROM devices d
      LEFT JOIN pickups p ON d.ngo_id = p.ngo_id AND p.status = 'completed'
      WHERE d.ngo_id = $1 AND d.updated_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', d.updated_at)
      ORDER BY month
    `, [ngoId]);

    const deviceTypesResult = await query(`
      SELECT 
        device_type,
        COUNT(*) as count,
        COALESCE(SUM(weight_kg), 0) as total_weight
      FROM devices 
      WHERE ngo_id = $1 AND status IN ('recycled', 'donated')
      GROUP BY device_type
      ORDER BY count DESC
    `, [ngoId]);

    // Calculate impact metrics
    const impactResult = await query(`
      SELECT 
        COALESCE(SUM(water_saved_liters), 0) as water_saved,
        COALESCE(SUM(co2_saved_kg), 0) as co2_saved,
        COALESCE(SUM(toxic_waste_prevented_kg), 0) as toxic_prevented
      FROM impact_reports ir
      INNER JOIN devices d ON ir.device_id = d.id
      WHERE d.ngo_id = $1
    `, [ngoId]);

    res.json({
      success: true,
      data: {
        overview: overviewResult.rows[0],
        monthly_stats: monthlyStatsResult.rows,
        device_types_breakdown: deviceTypesResult.rows,
        impact_metrics: impactResult.rows[0]
      }
    });

  } catch (error) {
    console.error('NGO overview error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO overview",
      error: error.message
    });
  }
});

router.get("/ngo/performance", authenticateToken, ngoOnly, async (req, res) => {
  try {
    const userId = req.user.id;

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

    const performanceResult = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE p.status = 'completed') as completed_pickups,
        COUNT(*) as total_pickups,
        CASE 
          WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE p.status = 'completed') * 100.0 / COUNT(*))
          ELSE 0 
        END as completion_rate,
        AVG(EXTRACT(EPOCH FROM (p.actual_pickup_time - p.created_at))/3600) as avg_response_time_hours,
        AVG(p.rating) as user_satisfaction,
        COUNT(DISTINCT p.user_id) as unique_customers
      FROM pickups p
      WHERE p.ngo_id = $1
    `, [ngoId]);

    const trendsResult = await query(`
      SELECT 
        DATE_TRUNC('week', p.pickup_date) as week,
        COUNT(*) as total_pickups,
        COUNT(*) FILTER (WHERE p.status = 'completed') as completed_pickups,
        AVG(p.rating) as avg_rating
      FROM pickups p
      WHERE p.ngo_id = $1 AND p.pickup_date >= NOW() - INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', p.pickup_date)
      ORDER BY week
    `, [ngoId]);

    res.json({
      success: true,
      data: {
        performance: performanceResult.rows[0],
        trends: trendsResult.rows
      }
    });

  } catch (error) {
    console.error('NGO performance error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO performance",
      error: error.message
    });
  }
});

// User analytics endpoints
router.get("/user/impact", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const impactResult = await query(`
      SELECT 
        COUNT(DISTINCT d.id) as total_devices_recycled,
        COALESCE(SUM(ir.water_saved_liters), 0) as total_water_saved,
        COALESCE(SUM(ir.co2_saved_kg), 0) as total_co2_saved,
        COALESCE(SUM(ir.toxic_waste_prevented_kg), 0) as total_toxic_prevented,
        COALESCE(SUM(ir.points_awarded), 0) as total_points_earned,
        COUNT(DISTINCT p.id) as total_pickups
      FROM users u
      LEFT JOIN devices d ON u.id = d.user_id AND d.status IN ('recycled', 'donated')
      LEFT JOIN impact_reports ir ON u.id = ir.user_id
      LEFT JOIN pickups p ON u.id = p.user_id AND p.status = 'completed'
      WHERE u.id = $1
    `, [userId]);

    const impactOverTimeResult = await query(`
      SELECT 
        DATE_TRUNC('month', ir.created_at) as month,
        COALESCE(SUM(ir.water_saved_liters), 0) as water_saved,
        COALESCE(SUM(ir.co2_saved_kg), 0) as co2_saved,
        COALESCE(SUM(ir.points_awarded), 0) as points_earned,
        COUNT(ir.device_id) as devices_processed
      FROM impact_reports ir
      WHERE ir.user_id = $1 AND ir.created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', ir.created_at)
      ORDER BY month
    `, [userId]);

    const achievementsResult = await query(`
      SELECT 
        b.name,
        b.description,
        b.badge_type,
        b.rarity,
        ub.earned_at
      FROM user_badges ub
      INNER JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: {
        total_impact: impactResult.rows[0],
        impact_over_time: impactOverTimeResult.rows,
        achievements: achievementsResult.rows
      }
    });

  } catch (error) {
    console.error('User impact error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user impact",
      error: error.message
    });
  }
});

// Global statistics (public endpoint)
router.get("/public/global", async (req, res) => {
  try {
    const globalResult = await query(`
      SELECT 
        COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'user') as total_users,
        COUNT(DISTINCT n.id) FILTER (WHERE n.verification_status = 'verified') as verified_ngos,
        COUNT(DISTINCT d.id) as total_devices,
        COUNT(DISTINCT d.id) FILTER (WHERE d.status IN ('recycled', 'donated')) as devices_processed,
        COALESCE(SUM(ir.water_saved_liters), 0) as total_water_saved,
        COALESCE(SUM(ir.co2_saved_kg), 0) as total_co2_saved,
        COALESCE(SUM(ir.toxic_waste_prevented_kg), 0) as total_toxic_prevented
      FROM users u
      FULL OUTER JOIN ngos n ON true
      FULL OUTER JOIN devices d ON true
      FULL OUTER JOIN impact_reports ir ON true
    `);

    res.json({
      success: true,
      data: globalResult.rows[0]
    });

  } catch (error) {
    console.error('Global statistics error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch global statistics",
      error: error.message
    });
  }
});

export default router;