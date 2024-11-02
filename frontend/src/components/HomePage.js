import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import "./HomePage.css";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [genre, setGenre] = useState("");
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch genres from the backend
    const fetchGenres = async () => {
      try {
        const res = await axios.get("/api/genres/home");
        setGenres(res.data);
      } catch (error) {
        console.error("Error fetching genres:", error.message);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    // Clear search results when the search criteria changes
    if (!query || !year || !rating || !genre) {
      setResults([]);
    }
  }, [query, year, rating, genre]);

  // Validate inputs before submitting the search form
  const validateInputs = () => {
    const errors = {};
    // Validate inputs
    if (query.trim().length > 100) {
      errors.query = "Title must be 100 characters or less.";
    }
    // Validate year
    if (year) {
      const currentYear = new Date().getFullYear();
      if (isNaN(year)) {
        errors.year = "Year must be a number.";
      } else if (year < 1900 || year > currentYear) {
        errors.year = `Year must be between 1900 and ${currentYear}.`;
      }
    }
    // Validate rating
    if (rating) {
      if (isNaN(rating)) {
        errors.rating = "Rating must be a number.";
      } else if (rating < 0 || rating > 10) {
        errors.rating = "Rating must be between 0 and 10.";
      }
    }

    return errors;
  };

  // Fetch search results from the backend
  const fetchSearchResults = async (params) => {
    try {
      const response = await axios.get("/api/movies/home", { params });
      setResults(response.data);
      // Catch any errors
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert(
          "You have reached the max number of requests. Please try again later."
        );
      } else {
        console.error("Error fetching data from TMDb: ", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    setLoading(true);
    // Validate inputs
    const validationErrors = validateInputs();

    // Display validation errors if any
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    // Clear previous errors
    setErrors({});

    // Prepare search parameters
    const searchParams = {
      query: query ? query.replace("*", "%") : undefined,
      year: year || undefined,
      rating: rating || undefined,
      genre: genre || undefined,
    };

    // Fetch search results
    await fetchSearchResults(searchParams);
  };

  return (
    <div className="home-page">
      <h2>Home</h2>
      <p>Search your next movie! Search by title or year, rating, and genre.</p>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-control">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            maxLength="100"
            placeholder="Search title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {errors.query && (
            <small id="title-error" className="text-danger">
              {errors.query}
            </small>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="Search by year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          {errors.year && (
            <small id="year-error" className="text-danger">
              {errors.year}
            </small>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            step="0.1"
            max="10"
            min="0"
            placeholder="Search by rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          {errors.rating && (
            <small id="rating-error" className="text-danger">
              {errors.rating}
            </small>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="genre">Genre:</label>
          <select
            className="form-control-item"
            id="genre"
            name="genre"
            title="Select Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">Select Genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="search-container">
          <button className="btn-search" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      <div className="search-results">
        {loading && <p>Loading...</p>}
        {!loading && results.length > 0 && (
          <div className="movie-card-container">
            {results.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        )}
        {!loading && hasSearched && results.length === 0 && (
          <div className="search-results">
            <p>No results found.</p>
          </div>
        )}
      </div>
      <div className="notice">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </div>
      <img className="logo" src="/tmdb_logo.svg" alt="TMDB Logo" />
    </div>
  );
};

export default HomePage;
