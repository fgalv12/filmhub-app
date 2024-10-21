import React, { useState } from "react";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleCardClick = () => {
    // Toggle showDetails state
    setShowDetails(!showDetails);
  };

  const handleOverlayClick = (e) => {
    // Prevent card click event from firing when overlay is clicked
    e.stopPropagation();
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <img
        className="movie-card-image"
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "/filmPoster.jpg"
        }
        alt={movie.title || movie.name}
      />
      <h3 className="movie-card-title">{movie.title || movie.name}</h3>
      {showDetails && (
        <div className="movie-card-overlay" onClick={handleOverlayClick}>
          <div className="movie-card-overlay-content">
            <p>
              <strong>Rating:</strong> {movie.vote_average.toFixed(1)}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {movie.release_date || movie.first_air_date}
            </p>
            <p>
              <strong>Overview:</strong> {movie.overview}
            </p>
            {/* Placeholder for Add to Watchlist button */}
            <button className="btn-add-watchlist">Add to Watchlist</button>
            <button
              className="btn-close-overlay"
              onClick={() => setShowDetails(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
