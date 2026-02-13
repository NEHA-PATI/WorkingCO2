const pool = require('../../config/db');

/* ===============================
   MONTHLY POINTS
================================ */
const getMonthlyPoints = async (u_id) => {
  const { rows } = await pool.query(`
    SELECT COALESCE(SUM(points),0) AS total
    FROM user_reward_events
    WHERE u_id = $1
      AND created_at >= date_trunc('month', CURRENT_DATE)
      AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
  `, [u_id]);

  return Number(rows[0].total);
};

/* ===============================
   RULE FETCH
================================ */
const getRule = async (action_key, action_type, milestone_weeks = null) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM reward_rules
    WHERE action_key = $1
      AND action_type = $2
      AND ($3::int IS NULL OR milestone_weeks = $3)
      AND is_active = TRUE
    LIMIT 1
  `, [action_key, action_type, milestone_weeks]);

  return rows[0];
};

/* ===============================
   CHECK IF EVENT EXISTS (prevent duplicate)
================================ */
const hasEventToday = async (u_id, action_key, action_type) => {
  const { rows } = await pool.query(`
    SELECT 1
    FROM user_reward_events
    WHERE u_id = $1
      AND action_key = $2
      AND action_type = $3
      AND activity_date = CURRENT_DATE
    LIMIT 1
  `, [u_id, action_key, action_type]);

  return rows.length > 0;
};

const hasMilestoneReward = async (u_id, weeks) => {
  const { rows } = await pool.query(`
    SELECT 1
    FROM user_reward_events
    WHERE u_id = $1
      AND action_type = 'consistency'
      AND milestone_weeks = $2
    LIMIT 1
  `, [u_id, weeks]);

  return rows.length > 0;
};

/* ===============================
   INSERT EVENT
================================ */
const insertRewardEvent = async ({
  u_id,
  action_key,
  action_type,
  points,
  activity_date = null,
  milestone_weeks = null
}) => {
  await pool.query(`
    INSERT INTO user_reward_events
    (u_id, action_key, action_type, points, activity_date, milestone_weeks)
    VALUES ($1,$2,$3,$4,$5,$6)
  `, [u_id, action_key, action_type, points, activity_date, milestone_weeks]);
};

/* ===============================
   STREAK LOGIC (real continuous streak)
================================ */
const getDailyStreak = async (u_id) => {
  const { rows } = await pool.query(`
    WITH ordered AS (
      SELECT activity_date,
             ROW_NUMBER() OVER (ORDER BY activity_date DESC) - 1 AS rn
      FROM user_reward_events
      WHERE u_id = $1
        AND action_key = 'daily_checkin'
        AND action_type = 'daily'
    )
    SELECT COUNT(*) AS streak
    FROM ordered
    WHERE activity_date = CURRENT_DATE - rn::INT;
  `, [u_id]);

  return Number(rows[0].streak);
};


/* ===============================
   GET ALL ACTIVE RULES
================================ */
const getAllActiveRules = async () => {
  const { rows } = await pool.query(`
    SELECT 
      action_key,
      action_type,
      points,
      milestone_weeks,
      max_points_per_day
    FROM reward_rules
    WHERE is_active = TRUE
    ORDER BY action_key, action_type, milestone_weeks
  `);

  return rows;
};


/* ===============================
   MONTHLY LEADERBOARD
================================ */
const getMonthlyLeaderboard = async (limit = 10) => {
  const { rows } = await pool.query(`
    SELECT 
      u_id,
      SUM(points) AS total_points
    FROM user_reward_events
    WHERE created_at >= date_trunc('month', CURRENT_DATE)
      AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY u_id
    ORDER BY total_points DESC
    LIMIT $1
  `, [limit]);

  return rows;
};

/* ===============================
   LIFETIME LEADERBOARD
================================ */
const getLifetimeLeaderboard = async (limit = 10) => {
  const { rows } = await pool.query(`
    SELECT 
      u_id,
      SUM(points) AS total_points
    FROM user_reward_events
    GROUP BY u_id
    ORDER BY total_points DESC
    LIMIT $1
  `, [limit]);

  return rows;
};

/* ===============================
   USER RANK (Monthly)
================================ */
const getUserMonthlyRank = async (u_id) => {
  const { rows } = await pool.query(`
    WITH ranked AS (
      SELECT 
        u_id,
        SUM(points) AS total_points,
        RANK() OVER (ORDER BY SUM(points) DESC) AS rank
      FROM user_reward_events
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
        AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY u_id
    )
    SELECT rank FROM ranked WHERE u_id = $1
  `, [u_id]);

  return rows[0]?.rank || null;
};

const getTodayStatus = async (u_id) => {
  const { rows } = await pool.query(`
    SELECT 
      action_key,
      SUM(points) as points
    FROM user_reward_events
    WHERE u_id = $1
      AND activity_date = CURRENT_DATE
    GROUP BY action_key
  `, [u_id]);

  return rows;
};
/* ===============================
   GET USER POINTS HISTORY
================================ */
/* ===============================
   GET USER POINTS HISTORY
================================ */
const getUserRewardHistory = async (u_id, limit = 20, offset = 0) => {
  const { rows } = await pool.query(`
    SELECT 
      event_id,
      action_key,
      action_type,
      points,
      milestone_weeks,
      activity_date,
      created_at
    FROM user_reward_events
    WHERE u_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `, [u_id, limit, offset]);

  return rows;
};



module.exports = {
  getMonthlyPoints,
  getRule,
  insertRewardEvent,
  getDailyStreak,
  hasEventToday,
  hasMilestoneReward,
  getAllActiveRules,
  getMonthlyLeaderboard,
  getLifetimeLeaderboard,
  getUserMonthlyRank,
  getTodayStatus,
  getUserRewardHistory
};
