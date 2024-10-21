const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const genreRoutes = require("./routes/genreRoutes");
const helmet = require("helmet");

// Load env variables
dotenv.config();
// Connect to MongoDB
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/genres", genreRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
