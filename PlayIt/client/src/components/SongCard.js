// SongCard component — displays individual song info and interaction buttons
import { useState } from "react";
import { Heart, EyeOff, ListPlus } from "lucide-react";

export default function SongCard({ song, onPlay, onLike, onHide, onQueue, liked }) {
  const [hovered, setHovered] = useState(false); // Tracks hover state for visual effects

  return (
    <div
      // Hover effects for interactivity and playback
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Prevents playing hidden songs
      onClick={() => !song.hidden && onPlay(song)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        boxShadow: hovered
          ? "0 6px 20px rgba(0,0,0,0.1)"
          : "0 2px 10px rgba(0,0,0,0.05)",
        padding: "0.8rem 1rem",
        width: "100%",
        cursor: song.hidden ? "not-allowed" : "pointer", // disables click if hidden
        transition: "all 0.25s ease",
        opacity: song.hidden ? 0.5 : 1, // dim hidden songs
      }}
    >
      {/* Left section — album art and song info */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <img
          src={song.coverUrl}
          alt={song.title}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "12px",
            objectFit: "cover",
            boxShadow: hovered
              ? "0 0 12px rgba(0,112,243,0.6)"
              : "0 0 10px rgba(0,112,243,0.3)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)", // zoom effect on hover
          }}
        />
        <div>
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
            {song.title}
          </h4>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
            {song.artist}
          </p>
        </div>
      </div>

      {/* Right section — interactive icons */}
      <div
        style={{
          display: "flex",
          gap: "0.8rem",
          alignItems: "center",
          opacity: hovered ? 1 : 0.8,
        }}
        onClick={(e) => e.stopPropagation()} // Prevents icon clicks from triggering play
      >
        {/* Like button — toggles song in favorites */}
        <Heart
          color={liked ? "#ff3b30" : "#bbb"}
          onClick={() => onLike(song)}
          style={{ cursor: "pointer" }}
        />

        {/* Hide button — marks song as hidden */}
        <EyeOff
          color={song.hidden ? "#ff9500" : "#bbb"}
          onClick={() => onHide(song)}
          style={{ cursor: "pointer" }}
        />

        {/* Queue button — adds song to play queue */}
        <ListPlus
          color="#0070f3"
          onClick={() => onQueue(song)}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
