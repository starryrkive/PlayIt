// src/pages/Stats.js
import { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import {
  getPlayCounts,
  ensurePlayCountsForSongs,
} from "../utils/statsUtils";

export default function Stats() {
  const [topSongs, setTopSongs] = useState([]);
  const [favArtist, setFavArtist] = useState(null);

  const computeStats = useCallback((songs) => {
    const counts = getPlayCounts();
    const list = Array.isArray(songs) ? songs : [];

    const withPlays = list.map((s) => {
      const id = s._id || s.id;
      return { ...s, plays: id ? counts[id] || 0 : 0 };
    });

    // Top 10 songs by total plays (same as before)
    const top10 = [...withPlays].sort((a, b) => b.plays - a.plays).slice(0, 10);
    setTopSongs(top10);

    // ---- NEW: most-played artist = artist with MOST DISTINCT SONGS PLAYED (>0) ----
    // Example: 7 different songs by X (even if each 1 time) beats 1 song by Y played 2x.
    const songsPerArtistPlayed = new Map(); // artist -> Set of songIds with plays>0
    for (const s of withPlays) {
      const id = s._id || s.id;
      const artist = s.artist || "Unknown Artist";
      if (!id) continue;
      if (s.plays > 0) {
        if (!songsPerArtistPlayed.has(artist)) songsPerArtistPlayed.set(artist, new Set());
        songsPerArtistPlayed.get(artist).add(id);
      }
    }

    // Pick artist with max distinct songs played; tiebreaker = higher total plays
    if (songsPerArtistPlayed.size > 0) {
      let bestArtist = null;
      let bestDistinct = -1;
      let bestTotal = -1;

      // precompute total plays by artist for tiebreaker only
      const totalPlaysByArtist = new Map();
      for (const s of withPlays) {
        const artist = s.artist || "Unknown Artist";
        totalPlaysByArtist.set(artist, (totalPlaysByArtist.get(artist) || 0) + (s.plays || 0));
      }

      for (const [artist, setOfIds] of songsPerArtistPlayed.entries()) {
        const distinct = setOfIds.size;
        const total = totalPlaysByArtist.get(artist) || 0;
        if (
          distinct > bestDistinct ||
          (distinct === bestDistinct && total > bestTotal)
        ) {
          bestArtist = artist;
          bestDistinct = distinct;
          bestTotal = total;
        }
      }

      // Display: show distinct count as "plays" label to match your UI wording
      setFavArtist({ artist: bestArtist, total: bestDistinct });
    } else {
      setFavArtist(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      let songs = [];
      try {
        const cached = JSON.parse(localStorage.getItem("songsData") || "[]");
        if (cached?.length) {
          songs = cached;
        } else {
          const { data } = await api.get("/songs");
          songs = data || [];
          localStorage.setItem("songsData", JSON.stringify(songs));
        }
      } catch (e) {
        console.error("Stats: failed to load songs", e);
      }

      if (!mounted) return;
      ensurePlayCountsForSongs(songs);
      computeStats(songs);
    };

    bootstrap();

    const onCountsUpdated = () => {
      const songs = JSON.parse(localStorage.getItem("songsData") || "[]");
      computeStats(songs);
    };
    window.addEventListener("playCountsUpdated", onCountsUpdated);

    // still keep a light poll as fallback
    const id = setInterval(onCountsUpdated, 2000);

    return () => {
      mounted = false;
      window.removeEventListener("playCountsUpdated", onCountsUpdated);
      clearInterval(id);
    };
  }, [computeStats]);

  // ---------- UI (unchanged) ----------
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, #f7f9fb, #e9eef4)",
        fontFamily: "SF Pro Display, Helvetica Neue, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            color: "#111",
            fontSize: "1.8rem",
          }}
        >
          Your Statistics 📈
        </h2>
        <div style={{ color: "#666", fontSize: "0.95rem" }}>
          {topSongs.length
            ? `${topSongs.reduce((a, s) => a + (s.plays || 0), 0)} plays across top 10`
            : "0 plays across top 10"}
        </div>
      </div>

      {/* Favorite Artist */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, rgba(0,112,243,0.1), rgba(0,112,243,0.2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#0070f3",
            }}
          >
            ★
          </div>
          <div>
            <div style={{ fontSize: "0.95rem", color: "#555" }}>
              Your most-played artist
            </div>
            <div
              style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111" }}
            >
              {favArtist ? favArtist.artist : "—"}
            </div>
          </div>
        </div>
        <div
          style={{
            fontWeight: 600,
            color: "#0070f3",
            background: "rgba(0,112,243,0.08)",
            borderRadius: 999,
            padding: "0.4rem 0.8rem",
          }}
        >
          {/* shows DISTINCT songs played count */}
          {favArtist ? `${favArtist.total} songs played` : "0 songs played"}
        </div>
      </div>

      {/* Top 10 Most Replayed */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontWeight: 700,
            color: "#111",
            fontSize: "1.2rem",
          }}
        >
          Top 10 Most Replayed
        </h3>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
        }}
      >
        {topSongs.length === 0 ? (
          <div
            style={{
              color: "#666",
              fontSize: "1rem",
              background: "white",
              borderRadius: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              padding: "1rem 1.25rem",
            }}
          >
            Play some tracks to populate your stats!
          </div>
        ) : (
          topSongs.map((song, i) => (
            <div
              key={song._id || song.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                padding: "1rem 1.25rem",
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease",
                width: "320px",
                height: "110px",
              }}
            >
              <div
                style={{
                  minWidth: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "rgba(0,112,243,0.1)",
                  color: "#0070f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
                title={`Rank #${i + 1}`}
              >
                {i + 1}
              </div>
              <img
                src={song.coverUrl}
                alt={song.title}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "14px",
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: "1rem",
                    margin: 0,
                    color: "#111",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={song.title}
                >
                  {song.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    margin: "0.3rem 0 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={song.artist}
                >
                  {song.artist}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(0,0,0,0.04)",
                  color: "#111",
                  padding: "0.35rem 0.6rem",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                }}
                title="Times played"
              >
                <span>🎧</span>
                <span>{song.plays || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
