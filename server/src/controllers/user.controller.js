const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res) => {
  try {
    // Optional: Validate request body first
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await userService.findUserByUsername(
      req.body.username
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await userService.createUser(req.body);

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "User creation failed",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Optional: Validate request body first
    if (!req.body.username) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Check if user exists
    const existingUser = await userService.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    //checking if the username is already taken
    if (req.body.username) {
      const userWithSameUsername = await userService.findUserByUsername(
        req.body.username
      );

      if (userWithSameUsername) {
        console.log("Matching user name: ", userWithSameUsername);

        return res.status(409).json({
          success: false,
          message: "Username already taken.",
        });
      }
      console.log("No match found.");
    }

    const updateUser = await userService.updateUser(userId, req.body);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updateUser,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "User update failed",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Optional: Validate request body first
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }
    // Check if user exists
    const existingUser = await userService.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updateUser = await userService.deleteUser(userId);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: updateUser,
    });
  } catch (err) {
    // You can add specific error handling here if needed
    res.status(500).json({
      success: false,
      message: err.message || "User deletion failed",
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
