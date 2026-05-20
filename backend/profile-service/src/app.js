const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://15.207.54.164:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-user-id" // 🔥 THIS IS THE FIX
  ],
}));

app.use(express.json());
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    service: "profile-service"
  });
});
app.use("/api/v1", routes);

module.exports = app;
