import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./MovieCard.css";

const MovieCard = ({ movie, showDeleteButton, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const handleCardClick = () => {
    // Toggle showDetails state
    setShowDetails(!showDetails);
  };

  const handleOverlayClick = (e) => {
    // Prevent card click event from firing when overlay is clicked
    e.stopPropagation();
  };

  // Fetch movie videos when showDetails is true
  useEffect(() => {
    const fetchVideos = async () => {
      if (showDetails && videos.length === 0) {
        setLoadingVideos(true);
        try {
          const response = await axios.get(`/api/movies/details/${movie.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          setVideos(response.data.videos.results);
        } catch (error) {
          console.error("Error fetching movie videos: ", error);
          toast.error("Failed to load trailer. Please try again.");
        } finally {
          setLoadingVideos(false);
        }
      }
    };

    fetchVideos();
  }, [showDetails, movie.id, videos.length]);

  const handleAddToWatchlist = async () => {
    try {
      await axios.post(
        "/api/watchlist",
        {
          movieId: movie.id,
          title: movie.title || movie.name,
          posterPath: movie.poster_path,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Movie added to watchlist!");
    } catch (error) {
      console.error("Error adding movie to watchlist: ", error);
      if (error.response && error.response.status === 400) {
        // Movie already in watchlist
        toast.info("Movie is already in your watchlist.");
      } else {
        toast.error("Error adding movie to watchlist. Please try again.");
      }
    }
  };

  const handleDeleteFromWatchlist = () => {
    if (onDelete) {
      onDelete(movie._id);
    }
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
              <strong>Rating:</strong> {""}
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {movie.release_date || movie.first_air_date || "Unknown"}
            </p>
            <p>
              <strong>Overview:</strong>{" "}
              {movie.overview || "No overview available."}
            </p>
            {loadingVideos ? (
              <p>Loading trailer...</p>
            ) : videos.length > 0 ? (
              <a
                className="trailer"
                href={`https://www.youtube.com/watch?v=${videos[0].key}`}
                target="_blank"
                rel="noreferrer"
              >
                Watch Trailer
              </a>
            ) : (
              <p>No trailer available.</p>
            )}
            {!showDeleteButton && (
              <button
                className="btn-add-watchlist"
                onClick={handleAddToWatchlist}
              >
                Add to Watchlist
              </button>
            )}
            {showDeleteButton && (
              <button
                className="btn-delete-watchlist"
                onClick={handleDeleteFromWatchlist}
              >
                Delete from Watchlist
              </button>
            )}
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
