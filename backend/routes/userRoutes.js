const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/authMiddleware");

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    // If user exists, check password
    if (user) {
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      // If password is correct, send back user data
      if (isMatch) {
        res.json({
          _id: user._id,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        // If password is incorrect, send error message
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      // If user does not exist, send error message
      res.status(401).json({ message: "User does not exist" });
    }
  } catch (error) {
    console.error("Error in login route: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Register route
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password, // Password hashed in the User model
    });

    // If user is created successfully, send back user data
    if (user) {
      return res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in register route: ", error);
    // Check for duplicate key error (email)
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
      //Handle other errors
    } else {
      return res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

// Get user profile route
router.get("/profile", protect, async (req, res) => {
  // Get user profile data and send it back
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error("Error fecthing data in get profile route: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile route
router.put("/profile", protect, async (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Check if user exists and update profile
  try {
    const user = await User.findById(req.user._id);

    // If user exists, update user profile
    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;

      await user.save();
      res.json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in update profile route: ", error.message);
    // Check for duplicate key error (email)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      return res.status(500).json({ message: "Server error" });
    }
  }
});

// Update password route
router.put("/update-password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Check if current password is correct
  try {
    const user = await User.findById(req.user._id);

    // If user exists, check if password is correct
    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      user.password = newPassword; // Password hashed in the User model

      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Current password is incorrect" });
    }
  } catch (error) {
    console.error("Error in update password route: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
