const express = require("express");
const axios = require("axios");
const router = express.Router();
const { query, validationResult } = require("express-validator");

router.get(
  "/home",
  [
    // Validate and sanitize query parameters
    query("query").optional().trim().escape(),
    query("year").optional().isNumeric().toInt(),
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

      if (searchQuery) {
        // Use search API if query is provided
        apiURL = "https://api.themoviedb.org/3/search/movie";
        params.query = searchQuery.replace("*", "%");
      } else {
        // Use discover API if no query is provided
        apiURL = "https://api.themoviedb.org/3/discover/movie";
        // params.sort_by = "popularity.desc";
      }

      // Add filters to params
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

module.exports = router;
