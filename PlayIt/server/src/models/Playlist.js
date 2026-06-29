import mongoose from "mongoose";

// Define the structure of a Playlist document
const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },           // Playlist name
    description: { type: String },                    // Optional description
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],  // Array of song IDs
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who made the playlist
  },
  { timestamps: true }
);

// Create the Playlist model
const Playlist = mongoose.model("Playlist", playlistSchema);

// ✅ Export it properly for ES modules
export default Playlist;
