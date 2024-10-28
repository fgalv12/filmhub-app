import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import WatchlistItem from "./WatchlistItem";
import "./WatchlistPage.css";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        // Fetch watchlist data from the backend
        const res = await axios.get("/api/watchlist", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const watchlistData = res.data;

        // Fetch movie details for each movie in the watchlist
        const movieDetailsPromises = watchlistData.map(async (movieItem) => {
          const response = await axios.get(
            `/api/movies/details/${movieItem.movieId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          const movieData = response.data;
          // Return the movie data along with the watchlist item details
          return {
            ...movieData,
            _id: movieItem._id,
            notes: movieItem.notes || "",
            priority: movieItem.priority || 1,
          };
        });

        const moviesDetails = await Promise.all(movieDetailsPromises);

        setWatchlist(moviesDetails);
      } catch (error) {
        console.error("Error fetching watchlist: ", error);
      }
    };

    fetchWatchlist();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/watchlist/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Remove the deleted movie from the watchlist state
      setWatchlist((prevWatchlist) =>
        prevWatchlist.filter((movie) => movie._id !== id)
      );

      //Display a success notification
      toast.success("Movie removed from watchlist!");
    } catch (error) {
      console.error("Error deleting item from watchlist: ", error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await axios.put(`/api/watchlist/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      console.log = res.data;

      // Update the watchlist state with the updated movie data
      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((movie) =>
          movie._id === id ? { ...movie, ...updatedData } : movie
        )
      );
    } catch (error) {
      console.error("Error updating item in watchlist: ", error);
    }
  };

  const sortedWatchlist = [...watchlist].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <div className="watchlist-page">
      <h2>Your Watchlist</h2>
      {watchlist.length > 0 ? (
        <table className="watchlist-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Movie</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Trailer</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedWatchlist.map((movie) => (
              <WatchlistItem
                key={movie._id}
                movie={movie}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>Your watchlist is empty</p>
      )}
    </div>
  );
};

export default WatchlistPage;
