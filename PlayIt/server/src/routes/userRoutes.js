import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route that requires JWT
router.get("/me", protect, getUserProfile);

export default router;
