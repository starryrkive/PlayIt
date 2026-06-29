import User from "../models/User.js"; // Import the User model for database operations
import jwt from "jsonwebtoken"; // Import JSON Web Token library for authentication
import Song from "../models/Song.js"; // Import the Song model (used for populating favorites)

// Toggle favorite song for a user
export const toggleFavorite = async (req, res) => {
  try {
    // Find the logged-in user by their ID from the request object (set by auth middleware)
    const user = await User.findById(req.user._id);
    const { songId } = req.body; // Extract the song ID from request body

    // Ensure a song ID is provided
    if (!songId) return res.status(400).json({ message: "No songId provided" });

    // Check if the song is already in user's favorites
    const index = user.favorites.indexOf(songId);

    // If not in favorites, add it; otherwise, remove it
    if (index === -1) {
      user.favorites.push(songId);
    } else {
      user.favorites.splice(index, 1);
    }

    // Save the updated user data
    await user.save();

    // Populate the favorites with song details for response
    const populated = await user.populate("favorites");
    res.json(populated); // Send back updated favorites
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to create a JWT token
const generateToken = (id) => {
  // Sign a new token containing the user ID, valid for 7 days
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Normalize email input to ensure consistency
    const emailNormalized = req.body.email.trim().toLowerCase();

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user record
    const newUser = await User.create({
      username,
      email: emailNormalized,
      password,
    });

    // Respond with new user info and a JWT token
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login an existing user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Successful login → return user info with JWT token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
