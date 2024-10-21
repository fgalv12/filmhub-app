const express = require("express");
const axios = require("axios");
const router = express.Router();

let cachedGenres = null;

router.get("/home", async (req, res) => {
  // Cache genres to avoid fetching them on every request
  if (cachedGenres) {
    return res.json(cachedGenres);
  }

  try {
    // Fetch data from TMDb
    const response = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
        },
      }
    );

    // Cache genres & send them to the client
    cachedGenres = response.data.genres;
    res.json(cachedGenres);
  } catch (error) {
    console.error("Error fetching genres from TMDb:", error.message);
    res.status(500).json({ message: "Error fetching genres" });
  }
});

module.exports = router;
