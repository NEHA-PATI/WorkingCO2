const express = require("express");
const cors = require("cors");
require("./src/config/env");

const app = express();

// Import Routes
const userRoutes = require("./src/routes/users.routes"); // make sure file name same hai
const orgRequestsRoutes = require("./src/routes/orgRequests.routes");

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Admin Service Running 🚀");
});

// Mount Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", orgRequestsRoutes);

module.exports = app;
