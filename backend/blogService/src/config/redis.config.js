import { createClient } from 'redis';
import { config } from './env.config.js';

let redisClient = null;

export const initRedis = async () => {
  if (!config.redis.enabled) {
    console.log('ℹ️  Redis is disabled');
    return null;
  }

  try {
    redisClient = createClient({
      url: config.redis.url,
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('✅ Redis connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    return null;
  }
};

export const getRedisClient = () => redisClient;

export const cacheGet = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const cacheSet = async (key, value, expirationInSeconds = 300) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.setEx(key, expirationInSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

export const cacheDelete = async (key) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};
