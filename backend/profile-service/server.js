require("dotenv").config();

const app = require("./src/app");
const { testConnection } = require("./src/config/db"); // agar DB use ho raha hai

const PORT = process.env.PORT || 5006;

/* -------------------- START SERVER -------------------- */
const startServer = async () => {
  try {
    console.log("🚀 Starting Profile Service...");

    // DB Connection Test (optional but recommended)
    if (testConnection) {
      await testConnection();
    }

    const server = app.listen(PORT, () => {
      console.log(`✅ Profile Service running on port ${PORT}`);
      console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
    });

    /* -------------------- GRACEFUL SHUTDOWN -------------------- */
    const shutdown = (signal) => {
      console.log(`\n⚠️ Received ${signal}. Shutting down...`);

      server.close(() => {
        console.log("🛑 Server closed");
        process.exit(0);
      });

      // Force shutdown after timeout
      setTimeout(() => {
        console.error("❌ Force shutdown");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();