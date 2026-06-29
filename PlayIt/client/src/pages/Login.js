import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      // Save user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);


      onAuth();
      navigate("/library"); // smoother navigation than window.location.href
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #eef3ff, #ffffff)",
        fontFamily: "SF Pro Display, Helvetica Neue, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "350px",
          background: "white",
          padding: "2.5rem",
          borderRadius: "25px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        <h1
          style={{
            marginBottom: "0.5rem",
            color: "#111",
            fontWeight: 700,
            fontSize: "1.8rem",
          }}
        >
          🎵 PlayIt
        </h1>
        <h3
          style={{
            marginBottom: "1.5rem",
            fontWeight: 500,
            color: "#333",
          }}
        >
          Log in to your music world
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "12px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0070f3";
              e.target.style.boxShadow = "0 0 0 3px rgba(0,112,243,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ddd";
              e.target.style.boxShadow = "none";
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "12px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0070f3";
              e.target.style.boxShadow = "0 0 0 3px rgba(0,112,243,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ddd";
              e.target.style.boxShadow = "none";
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.9rem 1rem",
              borderRadius: "12px",
              border: "none",
              background: loading ? "#a3c3f3" : "#0070f3",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s ease, transform 0.1s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = "#0059c1";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = "#0070f3";
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: "red",
              marginTop: "1rem",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}

        <div style={{ marginTop: "1.8rem" }}>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#0070f3",
                cursor: "pointer",
                fontWeight: 500,
                textDecoration: "underline",
              }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
