// uploadSongs.mjs
// This file uses the `.mjs` extension because it runs as an ES Module (uses `import` instead of `require`)

import fs from "fs"; // For reading local files (MP3s)
import FormData from "form-data"; // For creating multipart form data for uploads
import fetch from "node-fetch"; // To make HTTP requests from Node.js
import dotenv from "dotenv"; // For loading environment variables

dotenv.config(); // Initialize environment variables

// === CONFIGURATION ===
const baseURL = "http://localhost:5001/api/songs/upload"; // Backend API endpoint for uploading songs
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGNjZGU2NGYxYzRiZWYzZTlkNDk0ZCIsImlhdCI6MTc2MjQ0NjgyMiwiZXhwIjoxNzYzMDUxNjIyfQ.O6cN45H8RuvBDMvk5tFgkU0MW4NmQwZX7JbVgsm1IoA"; // JWT token from login (used for authentication)
const folder = "./src/uploads/test-songs"; // Local folder containing test MP3 files
// =====================

// Upload a single song file to the backend
async function uploadSong(filename) {
  const title = filename.replace(".mp3", ""); // Use filename (without .mp3) as the song title
  const form = new FormData(); // Create a new form instance
  form.append("title", title);
  form.append("artist", "PlayIt Test"); // Dummy artist name for testing
  form.append("genre", "lofi"); // Example genre
  form.append("songFile", fs.createReadStream(`${folder}/${filename}`)); // Attach actual MP3 file

  // Send POST request with form data
  const res = await fetch(baseURL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // Add auth token to header
    body: form, // Attach the form as request body
  });

  const data = await res.json(); // Parse backend response
  console.log(`Uploaded ${title}:`, res.status, data.message || data.title);
}

// Upload all MP3 files in the folder
async function uploadAll() {
  const files = fs.readdirSync(folder).filter((f) => f.endsWith(".mp3")); // Get all .mp3 files
  console.log(`Uploading ${files.length} songs...\n`);
  for (const file of files) {
    await uploadSong(file); // Upload each song sequentially
  }
  console.log("\n✅ Done! All songs uploaded.");
}

// Run the upload process
uploadAll();
