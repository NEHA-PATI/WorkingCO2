const express = require("express");
const walletRoutes = require("./src/routes/wallet.routes");
const errorMiddleware = require("./src/middlewares/error.middleware");
const { FRONTEND_URL } = require("./src/config/env");

const app = express();

app.use(express.json());

// CORS (frontend -> wallet service)
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  const allowedOrigins = new Set([FRONTEND_URL, "http://localhost:5173"]);

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Routes
app.use("/wallet", walletRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
