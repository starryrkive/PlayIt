import { useEffect, useState } from "react";
import { Heart, EyeOff, ListPlus } from "lucide-react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  if (favorites.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f7f9fb, #e9eef4)",
          fontFamily: "SF Pro Display, Helvetica Neue, Arial, sans-serif",
        }}
      >
        <h2 style={{ fontWeight: 600, color: "#333" }}>No Favorites Yet 💔</h2>
        <p style={{ color: "#666" }}>Add some songs to your favorites!</p>
      </div>
    );
  }

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
      }}
    >
      <h2
        style={{
          marginBottom: "2.5rem",
          fontWeight: 700,
          color: "#111",
          textAlign: "center",
          fontSize: "1.8rem",
        }}
      >
        Your Favorites ❤️
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "2.5rem", // 👈 this controls spacing between cards
          maxWidth: "1300px",
          width: "100%",
        }}
      >
        {favorites.map((song) => (
          <div
            key={song._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.05)",
              padding: "1rem 1.8rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
              width: "320px",
              height: "110px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.05)";
            }}
          >
            {/* Cover Image */}
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

            {/* Song Info */}
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontSize: "1rem",
                  margin: 0,
                  color: "#111",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {song.title}
              </h4>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  margin: "0.3rem 0 0",
                }}
              >
                {song.artist}
              </p>
            </div>

            {/* Icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
              }}
            >
              <Heart size={22} color="#e63946" />
              <EyeOff size={22} color="#999" />
              <ListPlus size={22} color="#0070f3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
