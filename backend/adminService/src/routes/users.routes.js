const express = require("express");
const router = express.Router();
const { fetchAllUsers } = require("../controllers/users.controller");

router.get("/users", fetchAllUsers);

module.exports = router;
