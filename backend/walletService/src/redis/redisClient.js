const Redis = require("ioredis");
const { REDIS_URL } = require("../config/env");

const redis = new Redis(REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error", err);
});

module.exports = redis;