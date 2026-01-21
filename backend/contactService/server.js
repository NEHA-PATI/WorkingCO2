const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/contact", contactRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "contact-service",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Contact Service Error:", err);
  res.status(500).json({
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`📨 Contact Service running on port ${PORT}`);
});