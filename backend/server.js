const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const genreRoutes = require("./routes/genreRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const helmet = require("helmet");

const app = express();
// Load env variables
dotenv.config();
// Connect to MongoDB
connectDB();

// Middleware
app.use(
  helmet({
    xssFilter: false,
  })
);
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
