import express from "express";
import { registerUser, loginUser, toggleFavorite } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Toggle favorite song (protected)
router.put("/favorite", protect, toggleFavorite);

export default router;
