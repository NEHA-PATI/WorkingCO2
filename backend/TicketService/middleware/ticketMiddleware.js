const pool = require("../config/db");

const verifyUser = async (req, res, next) => {
  try {
    const u_id =
      req.headers["x-user-id"] ||
      req.body?.u_id ||
      req.query?.u_id;

    if (!u_id) {
      return res.status(401).json({
        message: "User not logged in"
      });
    }

    const result = await pool.query(
      "SELECT u_id FROM users WHERE u_id = $1",
      [u_id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({
        message: "User not registered"
      });
    }

    req.user = { u_id };

    next();
  } catch (err) {
    console.error("VERIFY USER ERROR:", err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = { verifyUser };
