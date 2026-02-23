const userService = require("../services/users.service");

const fetchAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

module.exports = {
  fetchAllUsers
};
