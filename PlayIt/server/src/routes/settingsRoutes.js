import express from "express";
import { changePassword, deleteAccount } from "../controllers/settingsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router(); // Create an Express router

// Change user password (protected route)
router.put("/password", authMiddleware, changePassword);

// Delete user account (protected route)
router.delete("/account", authMiddleware, deleteAccount);

export default router; // Export the router
