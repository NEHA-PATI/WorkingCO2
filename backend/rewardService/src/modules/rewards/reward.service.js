const repo = require('./reward.repository');
const { MONTHLY_CAP } = require('../../config/constants');

const awardOneTime = async (u_id, action_key) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const rule = await repo.getRule(action_key, 'one_time');
  if (!rule) return;

  await repo.insertRewardEvent({
    u_id,
    action_key,
    action_type: 'one_time',
    points: rule.points
  });
};

const awardDailyCheckin = async (u_id) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const rule = await repo.getRule('daily_checkin', 'daily');
  if (!rule) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_checkin',
    action_type: 'daily',
    points: rule.points,
    activity_date: new Date()
  });

  await checkWeeklyMilestones(u_id);
};

const awardDailyQuiz = async (u_id, correctAnswers) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const rule = await repo.getRule('daily_quiz', 'daily');
  if (!rule) return;

  const points = Math.min(
    correctAnswers,
    rule.max_points_per_day,
    MONTHLY_CAP - monthly
  );

  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_quiz',
    action_type: 'daily',
    points,
    activity_date: new Date()
  });
};

const checkWeeklyMilestones = async (u_id) => {
  const streak = await repo.getDailyStreak(u_id);
  const weeks = Math.floor(streak / 7);

  if (weeks < 1 || weeks > 4) return;

  const rule = await repo.getRule('daily_checkin', 'consistency', weeks);
  if (!rule) return;

  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_checkin',
    action_type: 'consistency',
    points: rule.points,
    milestone_weeks: weeks,
    activity_date: new Date()
  });
};

module.exports = {
  awardOneTime,
  awardDailyCheckin,
  awardDailyQuiz
};
