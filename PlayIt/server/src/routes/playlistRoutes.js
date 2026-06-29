import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controllers/playlistController.js";

const router = express.Router(); // Create Express router

router.post("/", protect, createPlaylist); // Create playlist
router.get("/", protect, getUserPlaylists); // Get user playlists
router.put("/:id/add", protect, addSongToPlaylist); // Add song to playlist
router.put("/:id/remove", protect, removeSongFromPlaylist); // Remove song from playlist
router.delete("/:id", protect, deletePlaylist); // Delete playlist

export default router;
