import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Playlists() {
  const navigate = useNavigate();

  const [playlists] = useState([
    { id: 1, name: "Morning Vibes", songs: 5 },
    { id: 2, name: "Lo-Fi Nights", songs: 8 },
  ]);

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f9fb, #e9eef4)",
        fontFamily: "SF Pro Display, Helvetica Neue, Arial, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "2.5rem",
          fontWeight: 700,
          color: "#111",
          fontSize: "1.8rem",
        }}
      >
        Your Playlists 🎶
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        {playlists.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/playlists/${p.id}`)}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem 2rem",
              boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
              cursor: "pointer",
              width: "280px",
              textAlign: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.06)";
            }}
          >
            <h3
              style={{
                margin: "0 0 0.5rem",
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              {p.name}
            </h3>
            <p style={{ color: "#666", margin: 0 }}>{p.songs} songs</p>
          </div>
        ))}
      </div>
    </div>
  );
}
