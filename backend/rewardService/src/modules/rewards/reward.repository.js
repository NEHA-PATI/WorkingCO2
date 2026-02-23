const pool = require('../../config/db');
const isMissingUsersTableError = (error) => error?.code === '42P01';

/* ===============================
   MONTHLY POINTS
================================ */
const getMonthlyPoints = async (u_id) => {
  const { rows } = await pool.query(`
    SELECT COALESCE(SUM(points), 0) AS total
    FROM user_reward_events
    WHERE u_id = $1
      AND created_at >= date_trunc('month', CURRENT_DATE)
      AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
  `, [u_id]);

  return Number(rows[0].total);
};

const getTotalPoints = async (u_id) => {
  const { rows } = await pool.query(`
    SELECT COALESCE(SUM(points), 0) AS total
    FROM user_reward_events
    WHERE u_id = $1
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
   CHECK IF EVENT EXISTS
================================ */
const hasEventToday = async (u_id, action_key, action_type) => {
  const { rows } = await pool.query(`
    SELECT 1
    FROM user_reward_events
    WHERE u_id = $1
      AND action_key = $2
      AND action_type = $3
      AND DATE(activity_date AT TIME ZONE 'Asia/Kolkata')
    = DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
    LIMIT 1
  `, [u_id, action_key, action_type]);

  return rows.length > 0;
};

const hasEventEver = async (u_id, action_key, action_type = null) => {
  const { rows } = await pool.query(`
    SELECT 1
    FROM user_reward_events
    WHERE u_id = $1
      AND action_key = $2
      AND ($3::text IS NULL OR action_type = $3)
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
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [u_id, action_key, action_type, points, activity_date, milestone_weeks]);
};

const getLastEventByAction = async (u_id, action_key, action_type = null) => {
  const { rows } = await pool.query(`
    SELECT
      event_id,
      action_key,
      action_type,
      points,
      activity_date,
      created_at
    FROM user_reward_events
    WHERE u_id = $1
      AND action_key = $2
      AND ($3::text IS NULL OR action_type = $3)
    ORDER BY created_at DESC
    LIMIT 1
  `, [u_id, action_key, action_type]);

  return rows[0] || null;
};

const getContestTaskCompletions = async (u_id, actionKeys = []) => {
  if (!Array.isArray(actionKeys) || actionKeys.length === 0) {
    return [];
  }

  const { rows } = await pool.query(`
    SELECT
      action_key,
      action_type,
      COUNT(*) AS completion_count,
      MAX(created_at) AS last_completed_at
    FROM user_reward_events
    WHERE u_id = $1
      AND action_key = ANY($2::text[])
    GROUP BY action_key, action_type
  `, [u_id, actionKeys]);

  return rows;
};

/* ===============================
   STREAK LOGIC
================================ */
const getDailyStreak = async (u_id) => {
  const { rows } = await pool.query(`
    WITH days AS (
      SELECT DISTINCT
        DATE(activity_date AT TIME ZONE 'Asia/Kolkata') AS activity_day
      FROM user_reward_events
      WHERE u_id = $1
        AND action_key = 'daily_checkin'
        AND action_type = 'daily'
    ),
    last_day AS (
      SELECT MAX(activity_day) AS max_date FROM days
    ),
    ordered AS (
      SELECT
        activity_day,
        ROW_NUMBER() OVER (ORDER BY activity_day DESC) - 1 AS rn
      FROM days
    )
    SELECT COUNT(*) AS streak
    FROM ordered, last_day
    WHERE
      last_day.max_date >= DATE(NOW() AT TIME ZONE 'Asia/Kolkata') - INTERVAL '1 day'
      AND activity_day = last_day.max_date - rn::INT;
  `, [u_id]);

  return Number(rows[0].streak);
};


const getLongestDailyStreak = async (u_id) => {
  const { rows } = await pool.query(`
    WITH days AS (
      SELECT DISTINCT activity_date
      FROM user_reward_events
      WHERE u_id = $1
        AND action_key = 'daily_checkin'
        AND action_type = 'daily'
    ),
    grouped AS (
      SELECT
        activity_date,
        activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date))::INT AS grp
      FROM days
    ),
    streaks AS (
      SELECT grp, COUNT(*) AS streak
      FROM grouped
      GROUP BY grp
    )
    SELECT COALESCE(MAX(streak), 0) AS longest_streak
    FROM streaks
  `, [u_id]);

  return Number(rows[0].longest_streak);
};

const getLastCheckinDate = async (u_id) => {
  const { rows } = await pool.query(`
    SELECT MAX(activity_date) AS last_checkin_date
    FROM user_reward_events
    WHERE u_id = $1
      AND action_key = 'daily_checkin'
      AND action_type = 'daily'
  `, [u_id]);

  return rows[0]?.last_checkin_date || null;
};

/* ===============================
   GET ALL ACTIVE RULES
================================ */
const getAllActiveRules = async () => {
  const { rows } = await pool.query(`
    SELECT 
      rule_id,
      action_key,
      action_type,
      points,
      milestone_weeks,
      max_points_per_day,
      is_active,
      rules              -- 👈 ADD THIS LINE
    FROM reward_rules
    WHERE is_active = TRUE
    ORDER BY action_key, action_type, milestone_weeks
  `);

  return rows;
};


/* ===============================
   LEADERBOARD
================================ */
const getMonthlyLeaderboard = async (limit = 10, offset = 0) => {
  try {
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
      SELECT
        ranked.u_id,
        COALESCE(users.username, ranked.u_id) AS username,
        ranked.total_points,
        ranked.rank
      FROM ranked
      LEFT JOIN users ON users.u_id = ranked.u_id
      ORDER BY ranked.rank
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return rows;
  } catch (error) {
    if (!isMissingUsersTableError(error)) {
      throw error;
    }

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
      SELECT
        u_id,
        u_id AS username,
        total_points,
        rank
      FROM ranked
      ORDER BY rank
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return rows;
  }
};

const getLifetimeLeaderboard = async (limit = 10, offset = 0) => {
  try {
    const { rows } = await pool.query(`
      WITH ranked AS (
        SELECT
          u_id,
          SUM(points) AS total_points,
          RANK() OVER (ORDER BY SUM(points) DESC) AS rank
        FROM user_reward_events
        GROUP BY u_id
      )
      SELECT
        ranked.u_id,
        COALESCE(users.username, ranked.u_id) AS username,
        ranked.total_points,
        ranked.rank
      FROM ranked
      LEFT JOIN users ON users.u_id = ranked.u_id
      ORDER BY ranked.rank
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return rows;
  } catch (error) {
    if (!isMissingUsersTableError(error)) {
      throw error;
    }

    const { rows } = await pool.query(`
      WITH ranked AS (
        SELECT
          u_id,
          SUM(points) AS total_points,
          RANK() OVER (ORDER BY SUM(points) DESC) AS rank
        FROM user_reward_events
        GROUP BY u_id
      )
      SELECT
        u_id,
        u_id AS username,
        total_points,
        rank
      FROM ranked
      ORDER BY rank
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return rows;
  }
};

const getMonthlyLeaderboardCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(DISTINCT u_id) AS total
    FROM user_reward_events
    WHERE created_at >= date_trunc('month', CURRENT_DATE)
      AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
  `);

  return Number(rows[0].total);
};

const getLifetimeLeaderboardCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(DISTINCT u_id) AS total
    FROM user_reward_events
  `);

  return Number(rows[0].total);
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
    SELECT rank
    FROM ranked
    WHERE u_id = $1
  `, [u_id]);

  return rows[0]?.rank || null;
};

const getUserLifetimeRank = async (u_id) => {
  const { rows } = await pool.query(`
    WITH ranked AS (
      SELECT
        u_id,
        SUM(points) AS total_points,
        RANK() OVER (ORDER BY SUM(points) DESC) AS rank
      FROM user_reward_events
      GROUP BY u_id
    )
    SELECT rank
    FROM ranked
    WHERE u_id = $1
  `, [u_id]);

  return rows[0]?.rank || null;
};

const getTodayStatus = async (u_id) => {
  const { rows } = await pool.query(`
    SELECT
      action_key,
      SUM(points) AS points
    FROM user_reward_events
    WHERE u_id = $1
      AND DATE(activity_date AT TIME ZONE 'Asia/Kolkata')
    = DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
    GROUP BY action_key
  `, [u_id]);

  return rows;
};

/* ===============================
   USER POINTS HISTORY
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

const getUserRewardHistoryCount = async (u_id) => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) AS total
    FROM user_reward_events
    WHERE u_id = $1
  `, [u_id]);
  return Number(rows[0].total);
};
const getContestStats = async () => {
  const { rows } = await pool.query(`
    SELECT action_key, COUNT(*) AS completions
    FROM user_reward_events
    GROUP BY action_key
  `);

  return rows;
};
/* ===============================
   REWARD CATALOG
================================ */
const getRewardCatalogItems = async (limit = 12, offset = 0) => {
  const { rows } = await pool.query(`
    SELECT
      reward_id,
      name,
      description,
      points,
      image_url
    FROM reward_catalog
    WHERE is_active = TRUE
    ORDER BY points ASC, reward_id ASC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  return rows;
};

const getRewardCatalogCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) AS total
    FROM reward_catalog
    WHERE is_active = TRUE
  `);

  return Number(rows[0].total);
};

const getRewardById = async (reward_id) => {
  const { rows } = await pool.query(`
    SELECT
      reward_id,
      name,
      description,
      points,
      price_inr,
      image_url
    FROM reward_catalog
    WHERE reward_id = $1
      AND is_active = TRUE
    LIMIT 1
  `, [reward_id]);

  return rows[0] || null;
};
/* ===============================
   CREATE RULE
================================ */
const createRule = async ({
  action_key,
  action_type,
  points,
  milestone_weeks,
  max_points_per_day,
  rules = []
}) => {

  const { rows } = await pool.query(`
    INSERT INTO reward_rules
    (action_key, action_type, points, milestone_weeks, max_points_per_day, is_active, rules)
    VALUES ($1,$2,$3,$4,$5, TRUE, $6)
    RETURNING *
  `, [
    action_key,
    action_type,
    points,
    milestone_weeks,
    max_points_per_day,
    JSON.stringify(rules)   // 👈 IMPORTANT
  ]);

  return rows[0];
};


/* ===============================
   UPDATE RULE
================================ */
const updateRule = async (rule_id, {
  points,
  max_points_per_day,
  is_active,
  rules
}) => {

  const { rows } = await pool.query(`
    UPDATE reward_rules
    SET
      points = COALESCE($1, points),
      max_points_per_day = COALESCE($2, max_points_per_day),
      is_active = COALESCE($3, is_active),
      rules = COALESCE($4::jsonb, rules)
    WHERE rule_id = $5
    RETURNING *
  `, [
    points,
    max_points_per_day,
    is_active,
    rules ? JSON.stringify(rules) : null,
    rule_id
  ]);

  return rows[0];
};

module.exports = {
  getMonthlyPoints,
  getTotalPoints,
  getRule,
  hasEventToday,
  hasEventEver,
  hasMilestoneReward,
  insertRewardEvent,
  getLastEventByAction,
  getContestTaskCompletions,
  getDailyStreak,
  getLongestDailyStreak,
  getLastCheckinDate,
  getAllActiveRules,
  getMonthlyLeaderboard,
  getLifetimeLeaderboard,
  getMonthlyLeaderboardCount,
  getLifetimeLeaderboardCount,
  getUserMonthlyRank,
  getUserLifetimeRank,
  getTodayStatus,
  getUserRewardHistory,
  getUserRewardHistoryCount,
  getRewardCatalogItems,
  getRewardCatalogCount,
  getRewardById,
  getContestStats,
  createRule,
  updateRule
};
