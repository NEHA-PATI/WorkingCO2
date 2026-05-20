import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "./config/env.config.js";
import { testSanityConnection } from "./config/sanity.config.js";
import { initRedis } from "./config/redis.config.js";
import blogRoutes from "./routes/blog.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

/* ==================== TRUST PROXY (IMPORTANT FOR AWS) ==================== */
app.set("trust proxy", 1);

/* ==================== SECURITY ==================== */
app.use(helmet());
app.use(compression());

/* ==================== CORS ==================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // 🔥 ADD THIS (MOST IMPORTANT)
  "http://15.207.54.164:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ==================== BODY ==================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==================== RATE LIMIT ==================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
});

app.use("/api/", limiter);

/* ==================== ROOT ROUTE ==================== */
app.get("/", (req, res) => {
  res.send("🚀 Blog Service Running");
});

/* ==================== HEALTH ROUTE (PRODUCTION STANDARD) ==================== */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "blog-service",
    timestamp: new Date().toISOString(),
  });
});

/* ==================== API ROUTES ==================== */
app.use("/api/v1/blog", blogRoutes);

/* ==================== 404 ==================== */
app.use(notFoundHandler);

/* ==================== ERROR HANDLER ==================== */
app.use(errorHandler);

/* ==================== START SERVER ==================== */
const startServer = async () => {
  try {
    console.log("🔄 Starting Blog Service...");

    // 🔥 Sanity connection check
    await testSanityConnection();
    console.log("✅ Sanity connected");

    // 🔥 Redis init (optional)
    await initRedis();
    console.log("✅ Redis initialized (if enabled)");

    const PORT = process.env.PORT || config.port || 4000;

    // 🔥 IMPORTANT: bind to 0.0.0.0
    app.listen(PORT, "0.0.0.0", () => {
      console.log("\n========================================");
      console.log("🚀 Blog Service Started");
      console.log(`📡 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Server: http://0.0.0.0:${PORT}`);
      console.log(`📊 API: http://0.0.0.0:${PORT}/api/v1/blog`);
      console.log(`❤️ Health: http://0.0.0.0:${PORT}/api/v1/health`);
      console.log("========================================\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;