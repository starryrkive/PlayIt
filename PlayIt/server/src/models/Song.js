import mongoose from "mongoose";

// Define the structure of a Song document
const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },          // Song title
    artist: { type: String, required: true },         // Artist name
    album: { type: String },                          // Album name (optional)
    genre: { type: String },                          // Genre (optional)
    duration: { type: Number },                       // Duration in seconds
    fileUrl: { type: String, required: true },        // Path to the uploaded song file
    coverImage: { type: String },
    coverUrl: { type: String, default: "" },                     // Path or URL to album cover
  },
  { timestamps: true }                                // Automatically add createdAt and updatedAt
);

// Create the Song model
const Song = mongoose.model("Song", songSchema);

// ✅ Export it properly for ES modules
export default Song;
