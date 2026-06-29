import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.background =
      theme === "dark" ? "#0f0f0f" : "linear-gradient(135deg,#f7f9fb,#e9eef4)";
    document.body.style.color = theme === "dark" ? "#eee" : "#111";
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const { data } = await api.put("/settings/password", passwords);
      setMessage(data.message);
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating password");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!window.confirm("Are you sure? This action is irreversible!")) return;
    try {
      const { data } = await api.delete("/settings/account", {
        data: { password: deletePassword },
      });
      setMessage(data.message);
      localStorage.clear();
      window.location.href = "/register";
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting account");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background:
          theme === "dark"
            ? "radial-gradient(circle at top left, #111, #000)"
            : "linear-gradient(135deg,#f7f9fb,#e9eef4)",
        color: theme === "dark" ? "#fff" : "#111",
        fontFamily: "SF Pro Display, Helvetica Neue, Arial, sans-serif",
        paddingLeft: "240px", // replaces marginLeft (fixes the white gap)
        paddingRight: "2rem",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        transition: "all 0.3s ease",
      }}
    >
      <h2
        style={{
          marginBottom: "2rem",
          fontWeight: "600",
          fontSize: "1.75rem",
        }}
      >
        ⚙️ Settings
      </h2>

      {/* THEME TOGGLE */}
      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontWeight: "500" }}>Appearance</h3>
        <button
          onClick={handleThemeToggle}
          style={{
            padding: "0.7rem 1.2rem",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: theme === "dark" ? "#0070f3" : "#111",
            color: "white",
            marginTop: "1rem",
            transition: "all 0.3s ease",
          }}
        >
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </section>

      {/* CHANGE PASSWORD */}
      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontWeight: "500" }}>Change Password</h3>
        <form
          onSubmit={handlePasswordChange}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            maxWidth: "350px",
            marginTop: "1rem",
          }}
        >
          <input
            type="password"
            placeholder="Old password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
            style={inputStyle(theme)}
          />
          <input
            type="password"
            placeholder="New password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            style={inputStyle(theme)}
          />
          <button type="submit" style={buttonStyle("#0070f3")}>
            Update Password
          </button>
        </form>
      </section>

      {/* DELETE ACCOUNT */}
      <section>
        <h3 style={{ color: "#e63946", fontWeight: "500" }}>Danger Zone</h3>
        <form
          onSubmit={handleDeleteAccount}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            maxWidth: "350px",
            marginTop: "1rem",
          }}
        >
          <input
            type="password"
            placeholder="Enter password to delete account"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            style={inputStyle(theme)}
          />
          <button type="submit" style={buttonStyle("#e63946")}>
            Delete Account
          </button>
        </form>
      </section>

      {message && (
        <p
          style={{
            marginTop: "1.5rem",
            color: "#0070f3",
            fontWeight: "500",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const inputStyle = (theme) => ({
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "1rem",
  background: theme === "dark" ? "#1a1a1a" : "white",
  color: theme === "dark" ? "#eee" : "#111",
  transition: "border-color 0.2s ease",
});

const buttonStyle = (bg) => ({
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  border: "none",
  background: bg,
  color: "white",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background 0.2s ease, transform 0.1s ease",
});
