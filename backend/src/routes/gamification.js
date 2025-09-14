import express from "express";
import { query } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get user's current points and ranking
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const profileResult = await query(`
      SELECT 
        u.points,
        u.level,
        (SELECT COUNT(*) + 1 FROM users WHERE points > u.points AND role = 'user') as ranking,
        (SELECT COUNT(*) FROM users WHERE role = 'user' AND is_active = true) as total_users
      FROM users u
      WHERE u.id = $1
    `, [userId]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get user's badges
    const badgesResult = await query(`
      SELECT 
        b.id,
        b.name,
        b.description,
        b.badge_type,
        b.rarity,
        b.icon,
        ub.earned_at,
        ub.progress
      FROM user_badges ub
      INNER JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC
    `, [userId]);

    // Get next level requirements
    const currentLevel = profileResult.rows[0].level;
    const nextLevelPoints = Math.pow(currentLevel + 1, 2) * 100; // Points needed for next level

    // Get recent achievements
    const recentAchievementsResult = await query(`
      SELECT 
        b.name,
        b.description,
        b.rarity,
        ub.earned_at
      FROM user_badges ub
      INNER JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1 AND ub.earned_at >= NOW() - INTERVAL '30 days'
      ORDER BY ub.earned_at DESC
      LIMIT 5
    `, [userId]);

    res.json({
      success: true,
      data: {
        profile: {
          ...profileResult.rows[0],
          next_level_points: nextLevelPoints,
          points_to_next_level: nextLevelPoints - profileResult.rows[0].points
        },
        badges: badgesResult.rows,
        recent_achievements: recentAchievementsResult.rows
      }
    });

  } catch (error) {
    console.error('Gamification profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gamification profile",
      error: error.message
    });
  }
});

// Get leaderboard
router.get("/leaderboard", authenticateToken, async (req, res) => {
  try {
    const { timeframe = 'all', limit = 20, offset = 0 } = req.query;
    
    let timeCondition = '';
    if (timeframe === 'weekly') {
      timeCondition = "AND u.created_at >= NOW() - INTERVAL '7 days'";
    } else if (timeframe === 'monthly') {
      timeCondition = "AND u.created_at >= NOW() - INTERVAL '30 days'";
    }

    const leaderboardResult = await query(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY u.points DESC) as rank,
        u.name,
        u.points,
        u.level,
        COUNT(DISTINCT d.id) FILTER (WHERE d.status IN ('recycled', 'donated')) as devices_recycled,
        COALESCE(SUM(ir.water_saved_liters), 0) as water_saved,
        COALESCE(SUM(ir.co2_saved_kg), 0) as co2_saved,
        COUNT(DISTINCT ub.badge_id) as badges_earned
      FROM users u
      LEFT JOIN devices d ON u.id = d.user_id
      LEFT JOIN impact_reports ir ON u.id = ir.user_id
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      WHERE u.role = 'user' AND u.is_active = true ${timeCondition}
      GROUP BY u.id, u.name, u.points, u.level
      ORDER BY u.points DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Get user's position in leaderboard
    const userRankResult = await query(`
      SELECT 
        rank
      FROM (
        SELECT 
          u.id,
          ROW_NUMBER() OVER (ORDER BY u.points DESC) as rank
        FROM users u
        WHERE u.role = 'user' AND u.is_active = true ${timeCondition}
      ) ranked
      WHERE id = $1
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        leaderboard: leaderboardResult.rows,
        user_rank: userRankResult.rows[0]?.rank || null,
        timeframe,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: leaderboardResult.rows.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message
    });
  }
});

// Get available badges and progress
router.get("/badges", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all badges with user progress
    const badgesResult = await query(`
      SELECT 
        b.id,
        b.name,
        b.description,
        b.badge_type,
        b.rarity,
        b.icon,
        b.criteria,
        CASE 
          WHEN ub.user_id IS NOT NULL THEN true 
          ELSE false 
        END as earned,
        COALESCE(ub.progress, 0) as progress,
        ub.earned_at
      FROM badges b
      LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = $1
      ORDER BY 
        CASE WHEN ub.user_id IS NOT NULL THEN 0 ELSE 1 END,
        b.rarity DESC,
        b.name
    `, [userId]);

    // Calculate progress for specific badges
    const userStatsResult = await query(`
      SELECT 
        COUNT(DISTINCT d.id) FILTER (WHERE d.status IN ('recycled', 'donated')) as devices_recycled,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'completed') as pickups_completed,
        COALESCE(SUM(ir.water_saved_liters), 0) as water_saved,
        u.points,
        EXTRACT(DAY FROM NOW() - u.created_at) as days_active
      FROM users u
      LEFT JOIN devices d ON u.id = d.user_id
      LEFT JOIN pickups p ON u.id = p.user_id
      LEFT JOIN impact_reports ir ON u.id = ir.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.points, u.created_at
    `, [userId]);

    const userStats = userStatsResult.rows[0];

    // Update progress for badges that aren't earned yet
    const badgesWithProgress = badgesResult.rows.map(badge => {
      if (badge.earned) return badge;

      let calculatedProgress = 0;
      const criteria = JSON.parse(badge.criteria || '{}');

      switch (badge.badge_type) {
        case 'recycling':
          if (criteria.devices_required) {
            calculatedProgress = Math.min(100, (userStats.devices_recycled / criteria.devices_required) * 100);
          }
          break;
        case 'engagement':
          if (criteria.pickups_required) {
            calculatedProgress = Math.min(100, (userStats.pickups_completed / criteria.pickups_required) * 100);
          }
          break;
        case 'environmental':
          if (criteria.water_saved_required) {
            calculatedProgress = Math.min(100, (userStats.water_saved / criteria.water_saved_required) * 100);
          }
          break;
        case 'achievement':
          if (criteria.points_required) {
            calculatedProgress = Math.min(100, (userStats.points / criteria.points_required) * 100);
          }
          break;
        case 'community':
          if (criteria.days_active_required) {
            calculatedProgress = Math.min(100, (userStats.days_active / criteria.days_active_required) * 100);
          }
          break;
      }

      return {
        ...badge,
        progress: Math.round(calculatedProgress)
      };
    });

    res.json({
      success: true,
      data: {
        badges: badgesWithProgress,
        categories: [
          { type: 'recycling', name: 'Recycling Champion' },
          { type: 'environmental', name: 'Environmental Impact' },
          { type: 'engagement', name: 'Community Engagement' },
          { type: 'achievement', name: 'Milestones' },
          { type: 'community', name: 'Community Builder' }
        ]
      }
    });

  } catch (error) {
    console.error('Badges error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch badges",
      error: error.message
    });
  }
});

// Get community challenges
router.get("/challenges", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'active' } = req.query;

    let statusCondition = '';
    if (status === 'active') {
      statusCondition = "AND c.start_date <= NOW() AND c.end_date >= NOW()";
    } else if (status === 'upcoming') {
      statusCondition = "AND c.start_date > NOW()";
    } else if (status === 'completed') {
      statusCondition = "AND c.end_date < NOW()";
    }

    const challengesResult = await query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.challenge_type,
        c.target_value,
        c.reward_points,
        c.start_date,
        c.end_date,
        c.is_active,
        CASE 
          WHEN ucp.user_id IS NOT NULL THEN true 
          ELSE false 
        END as is_participating,
        COALESCE(ucp.current_progress, 0) as user_progress,
        COALESCE(ucp.completed, false) as user_completed,
        (
          SELECT COUNT(DISTINCT user_id) 
          FROM user_challenge_progress 
          WHERE challenge_id = c.id
        ) as total_participants,
        (
          SELECT COUNT(DISTINCT user_id) 
          FROM user_challenge_progress 
          WHERE challenge_id = c.id AND completed = true
        ) as completed_participants
      FROM community_challenges c
      LEFT JOIN user_challenge_progress ucp ON c.id = ucp.challenge_id AND ucp.user_id = $1
      WHERE c.is_active = true ${statusCondition}
      ORDER BY 
        CASE WHEN c.end_date >= NOW() THEN 0 ELSE 1 END,
        c.end_date ASC
    `, [userId]);

    res.json({
      success: true,
      data: {
        challenges: challengesResult.rows,
        status_filter: status
      }
    });

  } catch (error) {
    console.error('Challenges error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch challenges",
      error: error.message
    });
  }
});

// Join a community challenge
router.post("/challenges/:id/join", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.id;

    // Check if challenge exists and is active
    const challengeResult = await query(`
      SELECT id, title, start_date, end_date, is_active
      FROM community_challenges
      WHERE id = $1 AND is_active = true
    `, [challengeId]);

    if (challengeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found or not active"
      });
    }

    const challenge = challengeResult.rows[0];

    // Check if challenge has started
    if (new Date(challenge.start_date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Challenge has not started yet"
      });
    }

    // Check if challenge has ended
    if (new Date(challenge.end_date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Challenge has already ended"
      });
    }

    // Check if user is already participating
    const existingResult = await query(`
      SELECT id FROM user_challenge_progress
      WHERE user_id = $1 AND challenge_id = $2
    `, [userId, challengeId]);

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You are already participating in this challenge"
      });
    }

    // Join the challenge
    await query(`
      INSERT INTO user_challenge_progress (user_id, challenge_id, current_progress, completed, joined_at)
      VALUES ($1, $2, 0, false, NOW())
    `, [userId, challengeId]);

    res.json({
      success: true,
      message: `Successfully joined "${challenge.title}" challenge!`
    });

  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to join challenge",
      error: error.message
    });
  }
});

// Internal function to update user level based on points
export async function updateUserLevel(userId) {
  try {
    const userResult = await query(
      'SELECT points, level FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) return;

    const { points, level: currentLevel } = userResult.rows[0];
    const newLevel = Math.floor(Math.sqrt(points / 100));

    if (newLevel > currentLevel) {
      await query(
        'UPDATE users SET level = $1 WHERE id = $2',
        [newLevel, userId]
      );

      // Award level-up points bonus
      const bonusPoints = newLevel * 50;
      await query(
        'UPDATE users SET points = points + $1 WHERE id = $2',
        [bonusPoints, userId]
      );

      return { leveledUp: true, newLevel, bonusPoints };
    }

    return { leveledUp: false };
  } catch (error) {
    console.error('Update user level error:', error);
    return { leveledUp: false };
  }
}

// Internal function to check and award badges
export async function checkAndAwardBadges(userId) {
  try {
    // Get user stats
    const userStatsResult = await query(`
      SELECT 
        u.points,
        u.level,
        COUNT(DISTINCT d.id) FILTER (WHERE d.status IN ('recycled', 'donated')) as devices_recycled,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'completed') as pickups_completed,
        COALESCE(SUM(ir.water_saved_liters), 0) as water_saved,
        COALESCE(SUM(ir.co2_saved_kg), 0) as co2_saved,
        EXTRACT(DAY FROM NOW() - u.created_at) as days_active
      FROM users u
      LEFT JOIN devices d ON u.id = d.user_id
      LEFT JOIN pickups p ON u.id = p.user_id
      LEFT JOIN impact_reports ir ON u.id = ir.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.points, u.level, u.created_at
    `, [userId]);

    if (userStatsResult.rows.length === 0) return [];

    const userStats = userStatsResult.rows[0];

    // Get badges user hasn't earned yet
    const availableBadgesResult = await query(`
      SELECT b.id, b.name, b.badge_type, b.criteria, b.reward_points
      FROM badges b
      LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = $1
      WHERE ub.user_id IS NULL
    `, [userId]);

    const newBadges = [];

    for (const badge of availableBadgesResult.rows) {
      const criteria = JSON.parse(badge.criteria || '{}');
      let qualifies = false;

      switch (badge.badge_type) {
        case 'recycling':
          if (criteria.devices_required && userStats.devices_recycled >= criteria.devices_required) {
            qualifies = true;
          }
          break;
        case 'environmental':
          if (criteria.water_saved_required && userStats.water_saved >= criteria.water_saved_required) {
            qualifies = true;
          }
          if (criteria.co2_saved_required && userStats.co2_saved >= criteria.co2_saved_required) {
            qualifies = true;
          }
          break;
        case 'engagement':
          if (criteria.pickups_required && userStats.pickups_completed >= criteria.pickups_required) {
            qualifies = true;
          }
          break;
        case 'achievement':
          if (criteria.points_required && userStats.points >= criteria.points_required) {
            qualifies = true;
          }
          if (criteria.level_required && userStats.level >= criteria.level_required) {
            qualifies = true;
          }
          break;
        case 'community':
          if (criteria.days_active_required && userStats.days_active >= criteria.days_active_required) {
            qualifies = true;
          }
          break;
      }

      if (qualifies) {
        // Award the badge
        await query(`
          INSERT INTO user_badges (user_id, badge_id, earned_at, progress)
          VALUES ($1, $2, NOW(), 100)
        `, [userId, badge.id]);

        // Award points for earning the badge
        if (badge.reward_points > 0) {
          await query(
            'UPDATE users SET points = points + $1 WHERE id = $2',
            [badge.reward_points, userId]
          );
        }

        newBadges.push({
          id: badge.id,
          name: badge.name,
          reward_points: badge.reward_points
        });
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Check and award badges error:', error);
    return [];
  }
}

// Internal function to update challenge progress
export async function updateChallengeProgress(userId, challengeType, value = 1) {
  try {
    // Get active challenges the user is participating in
    const challengesResult = await query(`
      SELECT c.id, c.challenge_type, c.target_value, c.reward_points, ucp.current_progress
      FROM community_challenges c
      INNER JOIN user_challenge_progress ucp ON c.id = ucp.challenge_id
      WHERE ucp.user_id = $1 
        AND c.is_active = true 
        AND c.start_date <= NOW() 
        AND c.end_date >= NOW()
        AND ucp.completed = false
        AND c.challenge_type = $2
    `, [userId, challengeType]);

    const completedChallenges = [];

    for (const challenge of challengesResult.rows) {
      const newProgress = challenge.current_progress + value;
      const isCompleted = newProgress >= challenge.target_value;

      await query(`
        UPDATE user_challenge_progress 
        SET current_progress = $1, completed = $2, completed_at = $3
        WHERE user_id = $4 AND challenge_id = $5
      `, [newProgress, isCompleted, isCompleted ? new Date() : null, userId, challenge.id]);

      if (isCompleted) {
        // Award challenge completion points
        await query(
          'UPDATE users SET points = points + $1 WHERE id = $2',
          [challenge.reward_points, userId]
        );

        completedChallenges.push({
          id: challenge.id,
          reward_points: challenge.reward_points
        });
      }
    }

    return completedChallenges;
  } catch (error) {
    console.error('Update challenge progress error:', error);
    return [];
  }
}

export default router;