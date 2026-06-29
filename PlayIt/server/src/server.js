// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Import route handlers
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ Handles user profile data

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for the frontend (React app)
app.use(cors({ origin: "http://localhost:3000" }));

// Basic test route (you can hit this to confirm server is running)
app.get("/", (req, res) => {
  res.json({ ok: true, message: "PlayIt backend is running" });
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve uploaded files statically (e.g., songs)
app.use("/uploads", express.static("src/uploads"));

// Connect to MongoDB
connectDB();

// HTTP request logger for development
app.use(morgan("dev"));

// Mount API routes
app.use("/api/auth", authRoutes);       // Login, register, etc.
app.use("/api/songs", songRoutes);      // Song upload and playback
app.use("/api/playlists", playlistRoutes); // Playlist CRUD
app.use("/api/settings", settingsRoutes);  // Password & account settings
app.use("/api/users", userRoutes);         // ✅ Fetch user info (username, email, etc.)

// Fallback for non-existent routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler for catching unhandled errors
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Start server on provided PORT or 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
