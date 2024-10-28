import React, { useState } from "react";
// import axios from "axios";
import "./WatchlistItem.css";
import { toast } from "react-toastify";

const WatchlistItem = ({ movie, onDelete, onUpdate }) => {
  const [notes, setNotes] = useState(movie.notes || "");
  const [priority, setPriority] = useState(movie.priority || 1);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleSave = async () => {
    try {
      await onUpdate(movie._id, { notes, priority });
      toast.success("Watchlist item updated successfully!");
    } catch (error) {
      console.error("Error updating watchlist item: ", error);
      toast.error("Error updating watchlist item. Please try again.");
    }
  };

  const handleDelete = () => {
    onDelete(movie._id);
  };

  return (
    <tr>
      <td>
        <input
          type="number"
          min="1"
          max="5"
          value={priority}
          title="#1-5"
          onChange={handlePriorityChange}
        />
      </td>
      <td>
        <div className="movie-info">
          <img
            className="movie-poster"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                : "/filmPoster.jpg"
            }
            alt={movie.title}
          />
          <span>{movie.title}</span>
        </div>
      </td>
      <td className="movie-rating">
        {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
      </td>
      <td className="movie-description">
        <div className="description-text">
          {movie.overview || "No overview available."}
        </div>
      </td>
      <td className="movie-trailer">
        {movie.videos && movie.videos.results.length > 0 ? (
          <a
            href={`https://www.youtube.com/watch?v=${movie.videos.results[0].key}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch Trailer
          </a>
        ) : (
          "No trailer available"
        )}
      </td>
      <td>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add notes..."
        />
      </td>
      <td className="movie-actions">
        <button className="btn-save" onClick={handleSave}>
          Save
        </button>
        <button className="btn-delete" onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default WatchlistItem;
