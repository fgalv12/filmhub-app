const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Get user's watchlist
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add movie to watchlist
router.post("/", protect, async (req, res) => {
  const { movieId, title, posterPath, notes, priority, addedDate } = req.body;

  // Check if movieId and title exist
  try {
    const user = await User.findById(req.user._id);

    // Check if movie is already in watchlist
    const itemExists = user.watchlist.some((item) => item.movieId === movieId);
    // If movie is already in watchlist, return error
    if (itemExists) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    // Add movie to watchlist
    user.watchlist.push({
      movieId,
      title,
      posterPath,
      notes,
      priority,
      addedDate,
    });
    await user.save();

    res.json(user.watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update movie in watchlist
router.put("/:id", protect, async (req, res) => {
  const { id, addedDate } = req.params;
  const { notes, priority } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const item = user.watchlist.id(id);
    // If item exists, update notes
    if (item) {
      if (notes !== undefined) item.notes = notes;
      if (priority !== undefined) item.priority = priority;
      await user.save();
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete movie from watchlist
router.delete("/:id", protect, async (req, res) => {
  const { id } = req.params;
  // Check if id exists
  try {
    const user = await User.findById(req.user._id);
    // Filter out movie with id from watchlist
    user.watchlist = user.watchlist.filter(
      (item) => item._id.toString() !== id
    );

    await user.save();
    res.json(user.watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
