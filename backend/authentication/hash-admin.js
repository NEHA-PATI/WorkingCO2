// hash-admin.js
const bcrypt = require("bcryptjs"); // or 'bcrypt'

(async () => {
  const password = "Admin@01"; // choose your admin password
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hashed password:", hash);
})();
