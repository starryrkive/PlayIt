// UserProfile — displays user info and app about section
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [user, setUser] = useState({
    username: localStorage.getItem("username") || "Guest",
    email: localStorage.getItem("email") || "guest@example.com",
  });

  useEffect(() => {
    // Syncs user info from localStorage (if updated elsewhere)
    const handleStorage = () => {
      setUser({
        username: localStorage.getItem("username") || "Guest",
        email: localStorage.getItem("email") || "guest@example.com",
      });
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, #f7f9fb, #e9eef4)",
        fontFamily: "SF Pro Display, Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Profile header */}
      <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        User Profile 👤
      </h2>

      {/* User card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          padding: "2rem",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <img
          src="https://i.pinimg.com/736x/3d/b2/48/3db2487db08fd213155760e29deb5064.jpg"
          alt="User Avatar"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            marginBottom: "1rem",
            objectFit: "cover",
          }}
        />
        <h3 style={{ margin: "0.5rem 0", fontSize: "1.3rem" }}>{user.username}</h3>
        <p style={{ color: "#555", margin: 0 }}>{user.email}</p>
        <p style={{ marginTop: "0.8rem", color: "#777", fontSize: "0.9rem" }}>
          Member since 2025 • Loves music, vibes, and good coffee ☕
        </p>
      </div>

      {/* About PlayIt section */}
      <div
        style={{
          marginTop: "3rem",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          padding: "2rem",
          width: "100%",
          maxWidth: "700px",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>🎵 About PlayIt</h3>
        <p style={{ color: "#555", lineHeight: "1.6" }}>
          PlayIt is a sleek, personal music player built for simplicity and joy.
          Upload your tracks, curate your playlists, and explore your listening stats — all
          in one beautifully minimal interface. Built with ❤️ using React and Node.js,
          PlayIt believes music should be an experience, not just sound.
        </p>
      </div>
    </div>
  );
}
