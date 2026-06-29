// Navbar component — shows app title and manages user logout
export default function Navbar({ onLogout }) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        color: "#111",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* App title display */}
      <h2 style={{ margin: 0, fontWeight: 600, letterSpacing: "-0.5px" }}>
        🎵 PlayIt
      </h2>

      {/* Logout button — clears user session and redirects to login */}
      <button
        style={{
          background: "#0070f3",
          border: "none",
          color: "white",
          fontWeight: "bold",
          borderRadius: "8px",
          cursor: "pointer",
          padding: "0.5rem 1rem",
          transition: "background 0.3s ease",
        }}
        // visual hover state
        onMouseEnter={(e) => (e.target.style.background = "#0059c1")}
        onMouseLeave={(e) => (e.target.style.background = "#0070f3")}
        // logout logic
        onClick={() => {
          localStorage.removeItem("token"); // remove saved login token
          onLogout(); // notify parent to reset auth state
          window.location.href = "/login"; // navigate to login screen
        }}
      >
        Logout
      </button>
    </div>
  );
}
