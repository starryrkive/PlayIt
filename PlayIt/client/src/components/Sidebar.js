// Sidebar component — controls navigation, user info, and login/logout actions
import { useState, useEffect } from "react";
import {
  Library,
  Heart,
  ListMusic,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onToggle }) {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "Guest");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  // Sync user and theme changes from localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "username") setUsername(localStorage.getItem("username") || "Guest");
      if (e.key === "token") setLoggedIn(!!localStorage.getItem("token"));
      if (e.key === "theme") setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Collapse/expand sidebar
  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const newCollapsed = !prev;
      if (onToggle) onToggle(newCollapsed);
      return newCollapsed;
    });
  };

  // Logout clears localStorage and redirects
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedIn(false);
    setUsername("Guest");
    navigate("/login", { replace: true });
  };

  // Single navigation item
  const NavItem = ({ icon: Icon, label, to }) => (
    <div
      onClick={() => navigate(to)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? "0" : "12px",
        color: theme === "dark" ? "#eee" : "#333",
        padding: collapsed ? "0.75rem" : "0.75rem 1rem",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background =
          theme === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,112,243,0.1)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon size={22} color="#0070f3" />
      {!collapsed && <span style={{ fontSize: "0.95rem" }}>{label}</span>}
    </div>
  );

  // Login/logout button
  const AuthButton = ({ icon: Icon, label, color, onClick }) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? "0" : "10px",
        color,
        padding: collapsed ? "0.75rem" : "0.75rem 1rem",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "0.95rem",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      <Icon size={22} color={color} />
      {!collapsed && label}
    </div>
  );

  return (
    <div
      style={{
        height: "100vh",
        width: collapsed ? "80px" : "230px",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.3s ease, background 0.3s ease",
        backdropFilter: "blur(14px)",
        background:
          theme === "dark"
            ? "rgba(18, 18, 18, 0.7)"
            : "rgba(255, 255, 255, 0.6)",
        borderRight:
          theme === "dark"
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div>
        {/* Sidebar toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-end",
            padding: "1rem",
            cursor: "pointer",
          }}
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight size={22} color="#0070f3" />
          ) : (
            <ChevronLeft size={22} color="#0070f3" />
          )}
        </div>

        {/* User info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "2rem",
            padding: "0 1rem",
          }}
        >
          <img
            src="https://i.pinimg.com/736x/3d/b2/48/3db2487db08fd213155760e29deb5064.jpg"
            alt="User Avatar"
            style={{
              width: collapsed ? "45px" : "70px",
              height: collapsed ? "45px" : "70px",
              borderRadius: "50%",
              marginBottom: "0.5rem",
              objectFit: "cover",
            }}
          />

          {/* Username click navigates to user page */}
          {!collapsed && (
            <>
              <h3
                onClick={(e) => {
                  e.stopPropagation(); // prevent sidebar click bubbling
                  navigate("/user"); // go to user profile page
                }}
                style={{
                  fontSize: "1rem",
                  margin: 0,
                  fontWeight: 600,
                  color: theme === "dark" ? "#fff" : "#111",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {username}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: theme === "dark" ? "#aaa" : "#666",
                  marginTop: "0.3rem",
                }}
              >
                🎶 Music makes everything better.
              </p>
            </>
          )}
        </div>

        {/* Navigation links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            padding: "0 1rem",
          }}
        >
          <NavItem icon={Library} label="Library" to="/library" />
          <NavItem icon={Heart} label="Favorites" to="/favorites" />
          <NavItem icon={ListMusic} label="Playlists" to="/playlists" />
          <NavItem icon={BarChart2} label="Statistics" to="/stats" />
          <NavItem icon={Settings} label="Settings" to="/settings" />
        </div>
      </div>

      {/* Auth actions */}
      <div
        style={{
          padding: "1rem",
          borderTop:
            theme === "dark"
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {loggedIn ? (
          <AuthButton icon={LogOut} label="Logout" color="#e63946" onClick={handleLogout} />
        ) : (
          <AuthButton
            icon={LogIn}
            label="Login"
            color="#0070f3"
            onClick={() => navigate("/login", { replace: true })}
          />
        )}
      </div>
    </div>
  );
}
