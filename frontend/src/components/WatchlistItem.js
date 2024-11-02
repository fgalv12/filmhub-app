import React, { useState } from "react";
import "./WatchlistItem.css";
import { toast } from "react-toastify";

const WatchlistItem = ({ movie, onDelete, onUpdate }) => {
  const [notes, setNotes] = useState(movie.notes || "");
  const [priority, setPriority] = useState(movie.priority || 1);
  const [errors, setErrors] = useState({
    priority: "",
    notes: "",
  });

  // Validation Functions for Priority and Notes
  const validatePriority = (value) => {
    if (!value) {
      return "Priority is required.";
    }
    const number = Number(value);
    if (isNaN(number)) {
      return "Priority must be a number.";
    }
    if (number < 1 || number > 999) {
      return "Priority must be between 1 and 999.";
    }
    return "";
  };
  // Validate notes
  const validateNotes = (value) => {
    if (value.length > 300) {
      return "Notes cannot exceed 300 characters.";
    }
    return "";
  };

  // Event Handlers for Priority and Notes
  const handleNotesChange = (e) => {
    const value = e.target.value;
    setNotes(value);
    const errorMsg = validateNotes(value);
    setErrors((prevErrors) => ({ ...prevErrors, notes: errorMsg }));
  };

  // Event Handler for Priority Change
  const handlePriorityChange = (e) => {
    const value = e.target.value;
    setPriority(value);
    const errorMsg = validatePriority(value);
    setErrors((prevErrors) => ({ ...prevErrors, priority: errorMsg }));
  };

  // Save and Delete Functions
  const handleSave = async () => {
    const priorityError = validatePriority(priority);
    const notesError = validateNotes(notes);
    // If there are errors, set the state and show a toast message
    if (priorityError || notesError) {
      setErrors({
        priority: priorityError,
        notes: notesError,
      });
      toast.error("Please fix the input errors before saving.");
      return;
    }

    try {
      await onUpdate(movie._id, { notes, priority: Number(priority) });
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
          className={`priority-input ${errors.priority ? "input-error" : ""}`}
          type="number"
          min="1"
          max="999"
          value={priority}
          title="Set your priority"
          onChange={handlePriorityChange}
        />
        {errors.priority && (
          <span className="error-text">{errors.priority}</span>
        )}
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
          className={`notes-textarea ${errors.notes ? "input-error" : ""}`}
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add notes..."
          maxLength="300"
        />
        {errors.notes && <span className="error-text">{errors.notes}</span>}
      </td>
      <td className="movie-actions">
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={errors.priority || errors.notes}
          title="Save changes"
        >
          Save
        </button>
        <button
          className="btn-delete"
          onClick={handleDelete}
          title="Delete from watchlist"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default WatchlistItem;
