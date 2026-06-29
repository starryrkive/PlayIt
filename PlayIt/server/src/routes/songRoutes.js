import express from "express";
import multer from "multer";
import {
  getSongs,
  uploadSong,
  getSongById,
  deleteSong,
  searchSongs,
} from "../controllers/songController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router(); // Create an Express router instance

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  // Define where uploaded song files will be stored
  destination: (req, file, cb) => cb(null, "src/uploads"),

  // Define the naming convention for uploaded files
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage }); // Initialize multer with defined storage settings

// --- Public routes ---
// Fetch all songs
router.get("/", getSongs);

// Search songs by keyword
router.get("/search", searchSongs);

// Get a single song by ID
router.get("/:id", getSongById);

// --- Protected routes (require authentication) ---
// Upload a new song file
router.post("/upload", protect, upload.single("songFile"), uploadSong);

// Delete a song by ID
router.delete("/:id", protect, deleteSong);

export default router; // Export the router for use in the main server file
