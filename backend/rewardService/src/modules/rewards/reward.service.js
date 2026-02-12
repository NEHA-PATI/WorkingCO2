const repo = require('./reward.repository');
const { MONTHLY_CAP } = require('../../config/constants');

/* ===============================
   ONE TIME
================================ */
const awardOneTime = async (u_id, action_key) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const rule = await repo.getRule(action_key, 'one_time');
  if (!rule) return;

  const points = Math.min(rule.points, MONTHLY_CAP - monthly);
  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key,
    action_type: 'one_time',
    points
  });
};

/* ===============================
   DAILY CHECKIN
================================ */
const awardDailyCheckin = async (u_id) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const alreadyDone = await repo.hasEventToday(
    u_id,
    'daily_checkin',
    'daily'
  );
  if (alreadyDone) return;

  const rule = await repo.getRule('daily_checkin', 'daily');
  if (!rule) return;

  const points = Math.min(rule.points, MONTHLY_CAP - monthly);
  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_checkin',
    action_type: 'daily',
    points,
    activity_date: new Date()
  });

  await checkWeeklyMilestones(u_id);
};

/* ===============================
   DAILY QUIZ
================================ */
const awardDailyQuiz = async (u_id, correctAnswers) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const rule = await repo.getRule('daily_quiz', 'daily');
  if (!rule) return;

  const basePoints = Math.min(correctAnswers, rule.max_points_per_day);
  const points = Math.min(basePoints, MONTHLY_CAP - monthly);

  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_quiz',
    action_type: 'daily',
    points,
    activity_date: new Date()
  });
};

/* ===============================
   CONSISTENCY MILESTONE
================================ */
const checkWeeklyMilestones = async (u_id) => {
  const streak = await repo.getDailyStreak(u_id);
  const weeks = Math.floor(streak / 7);

  if (weeks < 1 || weeks > 4) return;

  const alreadyGiven = await repo.hasMilestoneReward(u_id, weeks);
  if (alreadyGiven) return;

  const rule = await repo.getRule(
    'daily_checkin',
    'consistency',
    weeks
  );
  if (!rule) return;

  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const points = Math.min(rule.points, MONTHLY_CAP - monthly);
  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_checkin',
    action_type: 'consistency',
    points,
    milestone_weeks: weeks,
    activity_date: new Date()
  });
};

module.exports = {
  awardOneTime,
  awardDailyCheckin,
  awardDailyQuiz
};
