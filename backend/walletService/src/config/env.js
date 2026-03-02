require("dotenv").config();

function requireEnv(key) {
  const value = process.env[key];

  if (!value) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }

  return value;
}

const config = {
  PORT: process.env.PORT || 5050,

  // Database Config
  DB: {
    HOST: requireEnv("DB_HOST"),
    PORT: requireEnv("DB_PORT"),
    USER: requireEnv("DB_USER"),
    PASSWORD: requireEnv("DB_PASSWORD"),
    NAME: requireEnv("DB_NAME"),
  },

  // JWT
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",

  JWT_OTP_SECRET: requireEnv("JWT_OTP_SECRET"),
  JWT_OTP_EXPIRES: process.env.JWT_OTP_EXPIRES || "10m",

  // Web3Auth
  WEB3AUTH_CLIENT_ID: requireEnv("WEB3AUTH_CLIENT_ID"),
  WEB3AUTH_ISSUER: requireEnv("WEB3AUTH_ISSUER"),

  // Frontend
  FRONTEND_URL: requireEnv("FRONTEND_URL"),

  // Email
  EMAIL_USER: requireEnv("EMAIL_USER"),
  EMAIL_PASS: requireEnv("EMAIL_PASS"),

  RESEND_API_KEY: requireEnv("RESEND_API_KEY"),
  FROM_EMAIL: requireEnv("FROM_EMAIL"),

  // Google OAuth
  GOOGLE_CLIENT_ID: requireEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: requireEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: requireEnv("GOOGLE_REDIRECT_URI"),
};

module.exports = config;