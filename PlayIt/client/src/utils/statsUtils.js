// src/utils/statsUtils.js

export const PLAY_COUNTS_KEY = "playCounts_global";

/**
 * Get the whole play-counts map from localStorage.
 * { [songId]: number }
 */
export function getPlayCounts() {
  try {
    return JSON.parse(localStorage.getItem(PLAY_COUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}

/**
 * Increment a song's play count once and notify listeners.
 */
export function incrementPlayCount(songId) {
  if (!songId) return;
  const counts = getPlayCounts();
  counts[songId] = (counts[songId] || 0) + 1;
  localStorage.setItem(PLAY_COUNTS_KEY, JSON.stringify(counts));

  // Let interested UIs (Stats page) update instantly
  window.dispatchEvent(new Event("playCountsUpdated"));
}

/**
 * Ensure every known song has a numeric key (default 0) without losing data.
 */
export function ensurePlayCountsForSongs(songs) {
  const counts = getPlayCounts();
  let mutated = false;

  for (const s of songs || []) {
    const id = s?._id || s?.id;
    if (!id) continue;
    if (typeof counts[id] !== "number") {
      counts[id] = 0;
      mutated = true;
    }
  }
  if (mutated) {
    localStorage.setItem(PLAY_COUNTS_KEY, JSON.stringify(counts));
  }
}
