// App.js — main application router and layout
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// --- Page imports ---
import Register from "./pages/Register";
import Login from "./pages/Login";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import Playlists from "./pages/Playlists";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import ArtistPage from "./pages/ArtistPage";
import PlaylistDetail from "./pages/PlaylistDetail";
import UserProfile from "./pages/UserProfile"; // ✅ new user profile page

// --- Components ---
import Sidebar from "./components/Sidebar";

export default function App() {
  // Track user authentication state
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  // Sidebar collapse state (used for dynamic spacing)
  const [collapsed, setCollapsed] = useState(false);

  // Handle user logout — clears stored credentials
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLogged(false);
  };

  // Apply consistent body styling on mount
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
    document.body.style.background = "linear-gradient(135deg, #f7f9fb, #e9eef4)";
  }, []);

  // Sidebar width changes dynamically when collapsed
  const sidebarWidth = collapsed ? 80 : 230;

  // --- PUBLIC ROUTES (Unauthenticated users) ---
  if (!logged) {
    return (
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login onAuth={() => setLogged(true)} />} />
          <Route path="/register" element={<Register onAuth={() => setLogged(true)} />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // --- PRIVATE ROUTES (Authenticated users only) ---
  return (
    <Router>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f7f9fb, #e9eef4)",
        }}
      >
        {/* Sidebar — persistent navigation */}
        <Sidebar onLogout={handleLogout} onToggle={setCollapsed} />

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            marginLeft: `${sidebarWidth}px`, // dynamically adjust for collapse
            transition: "margin-left 0.3s ease",
            background: "linear-gradient(135deg, #f7f9fb, #e9eef4)",
            overflowY: "auto",
            height: "100vh",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
           
          <Routes>
            {/* Redirect root to library */}
            <Route path="/" element={<Navigate to="/library" />} />

            {/* Main user pages */}
            <Route path="/library" element={<Library />} />
            <Route path="/favorites" element={<Favorites />} />

            {/* Playlist routes */}
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/playlists" element={<Playlists />} />

            {/* App utilities */}
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />

            {/* Artist-specific route */}
            <Route path="/artist/:artistName" element={<ArtistPage />} />

            {/* ✅ New User Profile route */}
            <Route path="/user" element={<UserProfile />} /> {/* displays user info */}

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/library" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
