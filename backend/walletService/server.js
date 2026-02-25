const { PORT } = require("./src/config/env");
const app = require("./app");

app.listen(PORT, () => {
  console.log(`Wallet Service running on port ${PORT}`);
});