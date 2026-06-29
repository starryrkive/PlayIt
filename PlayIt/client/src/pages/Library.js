import { useEffect, useState } from "react";
import { Play, Pause, Heart, PlusCircle, EyeOff, Search } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Player from "../components/Player";

export default function Library() {
  // --- STATE DECLARATIONS ---
  const [songs, setSongs] = useState([]); // all songs fetched from backend
  const [filteredSongs, setFilteredSongs] = useState([]); // visible songs after filtering
  const [searchTerm, setSearchTerm] = useState(""); // search input text
  const [current, setCurrent] = useState(null); // currently playing song
  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [queue, setQueue] = useState([]); // playback queue
  const [hiddenSongs, setHiddenSongs] = useState([]); // IDs of hidden songs

  // --- FETCH SONGS FROM BACKEND ---
  useEffect(() => {
    async function fetchSongs() {
      try {
        const { data } = await api.get("/songs");
        const cleaned = (Array.isArray(data) ? data : []).map((song) => ({
          ...song,
          artist: song.artist?.trim() || "Unknown Artist",
        }));
        setSongs(cleaned);
        setFilteredSongs(cleaned);
        localStorage.setItem("songsData", JSON.stringify(cleaned));
      } catch (err) {
        console.error("Error loading songs:", err);
      }
    }
    fetchSongs();
  }, []);

  // --- SAVE LIKED SONGS LOCALLY ---
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(liked));
  }, [liked]);

  // --- LIVE SEARCH FILTER ---
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lower) ||
        song.artist.toLowerCase().includes(lower)
    );
    setFilteredSongs(filtered);
  }, [searchTerm, songs]);

  // --- LIKE / UNLIKE ---
  const toggleLike = (song) => {
    if (liked.some((s) => s._id === song._id)) {
      setLiked(liked.filter((s) => s._id !== song._id));
    } else {
      setLiked([...liked, song]);
    }
  };

  // --- CHECK IF SONG IS LIKED ---
  const isLiked = (song) => liked.some((s) => s._id === song._id);

  // --- ADD SONG TO QUEUE ---
  const addToQueue = (song) => {
    if (!queue.some((q) => q._id === song._id)) {
      setQueue([...queue, song]);
    }
  };

  // --- HIDE / UNHIDE SONG ---
  const toggleHide = (song) => {
    if (hiddenSongs.includes(song._id)) {
      setHiddenSongs(hiddenSongs.filter((id) => id !== song._id));
    } else {
      setHiddenSongs([...hiddenSongs, song._id]);
    }
  };

  // --- PLAY SONG LOGIC ---
  const handlePlaySong = (song) => {
    const fullSong = songs.find((s) => s._id === song._id) || song;
    setCurrent({ ...fullSong });
  };

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
        paddingBottom: "220px", // leaves space for Player
      }}
    >
      {/* --- TOP BAR: TITLE + SEARCH BAR --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          marginBottom: "2.5rem",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {/* 🎵 App title — PlayIt brand logo */}
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: "1.6rem",
            display: "flex",
            alignItems: "center",
            letterSpacing: "-0.5px",
            whiteSpace: "nowrap",
          }}
        >
          🎵 <span style={{ color: "#111" }}>Play</span>
          <span style={{ color: "#0070f3" }}>It</span>
        </h2>

        {/* --- SEARCH BAR --- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            padding: "0.6rem 1rem",
            flex: 1,
          }}
        >
          <Search size={20} color="#0070f3" />
          <input
            type="text"
            placeholder="Search songs or artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "1rem",
              background: "transparent",
              color: "#111",
            }}
          />
        </div>
      </div>

      {/* --- PAGE HEADER --- */}
      <h2
        style={{
          marginBottom: "2.5rem",
          fontWeight: 700,
          color: "#111",
          textAlign: "center",
          fontSize: "1.8rem",
        }}
      >
        Your Library 🎶
      </h2>

      {/* --- SONG GRID --- */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "2.5rem",
          maxWidth: "1300px",
          width: "100%",
        }}
      >
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => {
            const isHidden = hiddenSongs.includes(song._id);
            return (
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
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease",
                  cursor: "pointer",
                  width: "320px",
                  height: "110px",
                  opacity: isHidden ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0,0,0,0.05)";
                }}
                onDoubleClick={() => {
                  if (isHidden) toggleHide(song);
                }}
              >
                {/* --- SONG COVER --- */}
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

                {/* --- SONG INFO --- */}
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

                  <Link
                    to={`/artist/${encodeURIComponent(song.artist)}`}
                    style={{
                      fontSize: "0.9rem",
                      color: "#0070f3",
                      margin: "0.3rem 0 0",
                      display: "inline-block",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#0051a8")}
                    onMouseLeave={(e) => (e.target.style.color = "#0070f3")}
                  >
                    {song.artist}
                  </Link>
                </div>

                {/* --- ACTION ICONS --- */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.9rem",
                  }}
                >
                  {current?._id === song._id ? (
                    <Pause
                      size={22}
                      color="#0070f3"
                      onClick={() => setCurrent(null)}
                    />
                  ) : (
                    <Play
                      size={22}
                      color="#0070f3"
                      onClick={() => handlePlaySong(song)}
                    />
                  )}
                  <Heart
                    size={22}
                    color={isLiked(song) ? "#e63946" : "#999"}
                    fill={isLiked(song) ? "#e63946" : "none"}
                    onClick={() => toggleLike(song)}
                  />
                  <EyeOff
                    size={22}
                    color="#999"
                    onClick={() => toggleHide(song)}
                  />
                  <PlusCircle
                    size={22}
                    color="#0070f3"
                    onClick={() => addToQueue(song)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: "#666", fontSize: "1rem", marginTop: "2rem" }}>
            No songs found.
          </p>
        )}
      </div>

      {/* --- SPACER BELOW --- */}
      <div style={{ height: 180, flexShrink: 0, width: "100%" }} />

      {/* --- PLAYER --- */}
      {current && (
        <Player
          song={current}
          queue={queue || []}
          setQueue={setQueue}
          onChangeSong={setCurrent}
          allSongs={songs}
        />
      )}
    </div>
  );
}
