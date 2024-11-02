const express = require("express");
const axios = require("axios");
const router = express.Router();
const { query, validationResult } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const dotenv = require("dotenv");

dotenv.config();

// Get search results
router.get(
  "/home",
  [
    // Validate and sanitize query parameters
    query("query").optional().trim().escape(),
    query("year")
      .optional()
      .isNumeric()
      .toInt({ min: 1900, max: new Date().getFullYear() }),
    query("rating").optional().isFloat({ min: 0, max: 10 }).toFloat(),
    query("genre").optional().isNumeric().toInt(),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query: searchQuery, genre, year, rating } = req.query;

    try {
      let apiURL;
      let params = {
        api_key: process.env.TMDB_API_KEY,
        watch_region: "US",
        language: "en-US",
        include_adult: false,
        page: 1,
      };
      // Determine which API to use based on query
      if (searchQuery) {
        // Use search API if query is provided
        apiURL = "https://api.themoviedb.org/3/search/movie";
        params.query = searchQuery;
      } else {
        // Use discover API if no query is provided
        apiURL = "https://api.themoviedb.org/3/discover/movie";
      }

      // Add filters to params if provided
      if (year) {
        params.primary_release_year = year;
      }

      if (rating) {
        params["vote_average.gte"] = rating;
      }

      if (genre) {
        params.with_genres = genre;
      }

      // Fetch data from TMDb
      const response = await axios.get(apiURL, { params });

      const results = response.data.results;

      // Send results to the client
      res.json(results);
    } catch (error) {
      if (error.response) {
        // Check if rate limit error
        if (error.response.status === 429) {
          console.error("Rate limit exceeded: ", error.response.data);
          return res
            .status(429)
            .json({ message: "Rate limit exceeded. Please try again later." });
        } else {
          console.error("Error fetching data from TMDb: ", error.message);
          res.status(500).json({ message: "Error fetching data from TMDb" });
        }
      } else {
        console.error("Error: ", error.message);
        res
          .status(500)
          .json({ message: "Server error. Please try again later." });
      }
    }
  }
);

// Get movie details
router.get("/details/:movieId", protect, async (req, res) => {
  const { movieId } = req.params;

  // Fetch movie details from TMDb
  try {
    const apiKey = process.env.TMDB_API_KEY;

    // Fetch movie details from TMDb
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: apiKey,
          language: "en-US",
          append_to_response: "videos",
        },
      }
    );
    // Send movie details to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching movie details: ", error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Movie not found" });
    } else {
      res.status(500).json({ message: "Error fecthing movie details." });
    }
  }
});

module.exports = router;
