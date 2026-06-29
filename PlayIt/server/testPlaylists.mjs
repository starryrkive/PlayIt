// testPlaylists.mjs
// This file uses the `.mjs` extension because it’s an ES Module (imports with 'import' syntax instead of 'require')

import fetch from "node-fetch"; // For making HTTP requests from Node.js
import dotenv from "dotenv"; // For loading environment variables from .env file

dotenv.config(); // Initialize environment variables

const baseURL = "http://localhost:5001/api"; // Base URL for API endpoints
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGNjZGU2NGYxYzRiZWYzZTlkNDk0ZCIsImlhdCI6MTc2MjQ0NjgyMiwiZXhwIjoxNzYzMDUxNjIyfQ.O6cN45H8RuvBDMvk5tFgkU0MW4NmQwZX7JbVgsm1IoA"; // JWT token from login (for authorization)

// Helper for sending JSON requests to the backend
async function sendJSON(url, method, body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = `Bearer ${token}`; // Attach token if required

  const res = await fetch(`${baseURL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  console.log(`\n👉 [${method}] ${url}`);
  console.log("Status:", res.status, res.statusText);
  console.log("Response:", data);
  return data;
}

// Create a new playlist
async function createPlaylist() {
  return await sendJSON("/playlists", "POST", {
    name: "lofi vibes",
    description: "soft chill beats to study or code",
  });
}

// Fetch all songs (public route)
async function getSongs() {
  return await sendJSON("/songs", "GET", null, false);
}

// Add multiple songs to a playlist
async function addSongs(playlistId, songIds) {
  for (const id of songIds) {
    await sendJSON(`/playlists/${playlistId}/add`, "PUT", { songId: id });
  }
}

// Remove a single song from playlist
async function removeSong(playlistId, songId) {
  await sendJSON(`/playlists/${playlistId}/remove`, "PUT", { songId });
}

// Toggle a song as favorite
async function toggleFavorite(songId) {
  await sendJSON("/auth/favorite", "PUT", { songId });
}

// Main test execution flow
(async () => {
  // Step 1: Fetch songs
  const songs = await getSongs();
  const songIds = songs.slice(0, 5).map((s) => s._id); // Select first 5 songs

  // Step 2: Create a playlist
  const playlist = await createPlaylist();

  // Step 3: Add selected songs to playlist
  await addSongs(playlist._id, songIds);

  // Step 4: Remove the first song from the playlist
  await removeSong(playlist._id, songIds[0]);

  // Step 5: Mark one song as favorite
  await toggleFavorite(songIds[1]);

  console.log("\n✅ Playlist and favorites test completed successfully!");
})();
