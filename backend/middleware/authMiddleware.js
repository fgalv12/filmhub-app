const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect route
// Check if token exists and is valid
const protect = async (req, res, next) => {
  let token;

  // Check if token exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console;
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If token does not exist or does not start with Bearer return error
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
