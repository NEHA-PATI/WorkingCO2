const express = require("express");
const cors = require("cors");

const app = express();

// Import Routes
const userRoutes = require("./src/routes/users.routes"); // make sure file name same hai

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Admin Service Running 🚀");
});

// Mount Routes
app.use("/api/v1", userRoutes);

module.exports = app;
