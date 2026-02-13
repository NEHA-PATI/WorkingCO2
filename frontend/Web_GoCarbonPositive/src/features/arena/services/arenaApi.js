import axios from 'axios';
import { ENV } from '@config/env';

const resolveRewardsBaseUrl = () => {
  const raw = (ENV.REWARD_SERVICE_URL || '').replace(/\/+$/, '');

  if (!raw) {
    return '/api/v1/rewards';
  }

  if (raw.endsWith('/api/v1/rewards')) {
    return raw;
  }

  if (raw.endsWith('/api/v1')) {
    return `${raw}/rewards`;
  }

  return `${raw}/api/v1/rewards`;
};

const rewardsClient = axios.create({
  baseURL: resolveRewardsBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

rewardsClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'Reward service unreachable. Check REWARD_SERVICE_URL, server status, and CORS.';
    }
    return Promise.reject(error);
  }
);

const getStoredUserId = () => {
  try {
    const rawUser = localStorage.getItem('authUser');
    const parsedUser = rawUser ? JSON.parse(rawUser) : null;
    return parsedUser?.u_id || ENV.DEFAULT_USER_ID || null;
  } catch {
    return ENV.DEFAULT_USER_ID || null;
  }
};

const getAuthHeaders = () => {
  const uId = getStoredUserId();
  if (!uId) {
    throw new Error('Missing user id for Arena reward requests');
  }

  const token = localStorage.getItem('authToken');
  const headers = {
    'x-user-id': uId
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseApiData = (response) => response?.data || {};

export const arenaApi = {
  async getHealth() {
    const res = await rewardsClient.get('/health');
    return parseApiData(res);
  },

  async getContestMetadata() {
    const res = await rewardsClient.get('/contest-metadata');
    const payload = parseApiData(res);
    return payload.data || [];
  },

  async getContestStatus() {
    const res = await rewardsClient.get('/contest-status', {
      headers: getAuthHeaders()
    });
    const payload = parseApiData(res);
    return payload.data || [];
  },

  async completeOneTimeTask(taskType) {
    const res = await rewardsClient.post(
      '/one-time',
      { action_key: taskType },
      { headers: getAuthHeaders() }
    );
    const payload = parseApiData(res);
    return payload.data || payload;
  },

  async completeDailyCheckin() {
    const res = await rewardsClient.post(
      '/daily-checkin',
      {},
      { headers: getAuthHeaders() }
    );
    const payload = parseApiData(res);
    return payload.data || payload;
  },

  async completeDailyQuiz(correctAnswers) {
    const res = await rewardsClient.post(
      '/daily-quiz',
      { correctAnswers },
      { headers: getAuthHeaders() }
    );
    const payload = parseApiData(res);
    return payload.data || payload;
  },

  async completeScoreTask(taskType, score) {
    const res = await rewardsClient.post(
      '/score-task',
      { task_type: taskType, score },
      { headers: getAuthHeaders() }
    );
    const payload = parseApiData(res);
    return payload.data || payload;
  },

  async getStreak() {
    const res = await rewardsClient.get('/streak', {
      headers: getAuthHeaders()
    });
    return parseApiData(res);
  },

  async getLeaderboard({ type = 'monthly', page = 1, limit = 10 } = {}) {
    const res = await rewardsClient.get('/leaderboard', {
      params: { type, page, limit }
    });
    const payload = parseApiData(res);
    return {
      data: payload.data || [],
      page: payload.page || page,
      limit: payload.limit || limit,
      total: payload.total || 0,
      totalPages: payload.totalPages || 1
    };
  },

  async getMyRank() {
    const res = await rewardsClient.get('/my-rank', {
      headers: getAuthHeaders()
    });
    const payload = parseApiData(res);
    return payload.rank ?? null;
  },

  async getRewardCatalog({ page = 1, limit = 12 } = {}) {
    const res = await rewardsClient.get('/catalog', {
      params: { page, limit }
    });
    const payload = parseApiData(res);
    return {
      data: payload.data || [],
      page: payload.page || page,
      limit: payload.limit || limit,
      total: payload.total || 0,
      totalPages: payload.totalPages || 1
    };
  },

  async redeemReward(rewardId) {
    const res = await rewardsClient.post(
      '/redeem',
      { reward_id: rewardId },
      { headers: getAuthHeaders() }
    );
    const payload = parseApiData(res);
    return payload.data || null;
  },

  async getRewardHistory({ page = 1, limit = 20 } = {}) {
    const res = await rewardsClient.get('/history', {
      headers: getAuthHeaders(),
      params: { page, limit }
    });
    const payload = parseApiData(res);
    return {
      data: payload.data || [],
      page: payload.page || page,
      limit: payload.limit || limit,
      total: payload.total || 0,
      totalPages: payload.totalPages || 1
    };
  },

  async getMyPoints() {
    const res = await rewardsClient.get('/my-points', {
      headers: getAuthHeaders()
    });
    return parseApiData(res);
  }
};

export default arenaApi;
