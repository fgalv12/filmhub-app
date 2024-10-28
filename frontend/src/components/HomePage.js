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
    if (!query || !year || !rating || !genre) {
      setResults([]);
    }
  }, [query, year, rating, genre]);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    setLoading(true);

    let validationErrors = {};

    // Input validation
    if (
      year &&
      (isNaN(year) || year < 1900 || year > new Date().getFullYear())
    ) {
      validationErrors.year = "Please enter a valid year after 1900.";
    }
    // Validate rating
    if (rating && (isNaN(rating) || rating < 0 || rating > 10)) {
      validationErrors.rating = "Please enter a valid rating between 0 and 10.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    // Fetch search results from the backend
    try {
      const res = await axios.get("/api/movies/home", {
        params: {
          query: query.replace("*", "%"),
          year,
          rating,
          genre,
        },
      });
      setResults(res.data);
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

  return (
    <div className="home-page">
      <h2>Home</h2>
      <p>Search your next movie and TV show!</p>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-control">
          <label>Title:</label>
          <input
            type="text"
            placeholder="Search title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {errors.query && (
            <small className="text-danger">{errors.query}</small>
          )}
        </div>
        <div className="form-control">
          <label>Year:</label>
          <input
            type="number"
            placeholder="Search by year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          {errors.year && <small className="text-danger">{errors.year}</small>}
        </div>
        <div className="form-control">
          <label>Rating:</label>
          <input
            type="number"
            step="0.1"
            max="10"
            min="0"
            placeholder="Search by rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          {errors.rating && (
            <small className="text-danger">{errors.rating}</small>
          )}
        </div>
        <div className="form-control">
          <label>Genre:</label>
          <select
            className="form-control-item"
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
        <button className="btn-search" type="submit">
          Search
        </button>
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
    </div>
  );
};

export default HomePage;
