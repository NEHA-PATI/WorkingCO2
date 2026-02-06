const express = require("express");
const demoRoutes = require("./routes/demo.routes");

const app = express();

app.use(express.json());
app.use("/api", demoRoutes);

app.get("/health", (_, res) => {
  res.status(200).json({ status: "UP" });
});

module.exports = app;
