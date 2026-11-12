const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-user-id" // 🔥 THIS IS THE FIX
  ],
}));

app.use(express.json());
app.use("/api", routes);

module.exports = app;
