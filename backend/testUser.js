const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
dotenv.config();
const connectDB = require("./config/db");
connectDB();

const createTestUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = new User({
      firstName: "Test",
      lastName: "User",
      email: "testuser@email.com",
      password: hashedPassword,
    });

    await user.save();
    console.log("Test user created");
    process.exit();
  } catch (error) {
    console.error("Error creating test user:", error.message);
    process.exit(1);
  }
};

createTestUser();
