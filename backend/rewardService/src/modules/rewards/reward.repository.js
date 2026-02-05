const pool = require('../../config/db');

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
    ON CONFLICT DO NOTHING
  `, [u_id, action_key, action_type, points, activity_date, milestone_weeks]);
};

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


module.exports = {
  getMonthlyPoints,
  getRule,
  insertRewardEvent,
  getDailyStreak
};
