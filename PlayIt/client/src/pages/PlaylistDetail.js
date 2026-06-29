import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  Shuffle,
  Repeat,
  Plus,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import api from "../utils/api";
import Player from "../components/Player";

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // 🧠 Load playlist + songs
  useEffect(() => {
    const playlists = [
      { id: 1, name: "Morning Vibes" },
      { id: 2, name: "Lo-Fi Nights" },
    ];
    const found = playlists.find((p) => p.id === Number(id));
    setPlaylist(found || { id, name: "Custom Playlist" });

    async function loadSongs() {
      try {
        const { data } = await api.get("/songs");
        setAllSongs(data);
        setSongs(data.slice(0, 6)); // Load some demo songs
        setQueue(data.slice(0, 6)); // initial queue
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    }
    loadSongs();
  }, [id]);

  // ▶️ Play/Pause a single song
  const togglePlay = (song) => {
    if (current?._id === song._id && isPlaying) {
      setIsPlaying(false);
      setCurrent(null);
    } else {
      setCurrent(song);
      setQueue(shuffle ? shuffleArray(songs) : songs);
      setIsPlaying(true);
    }
  };

  // 🔁 Helper: Shuffle Array
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // ▶️ “Play All”
  const handlePlayAll = () => {
    if (!songs.length) return;
    const list = shuffle ? shuffleArray(songs) : [...songs];
    setQueue(list);
    setCurrent(list[0]);
    setIsPlaying(true);
  };

  // 🔀 Shuffle toggle
  const handleShuffle = () => {
    if (shuffle) {
      // turning off shuffle → restore queue to original song order
      setShuffle(false);
      setQueue([...songs]);
    } else {
      // turning on shuffle → randomize order
      setShuffle(true);
      setQueue(shuffleArray([...songs]));
    }
  };

  // ➕ Add Song
  const handleAddSong = (song) => {
    if (!songs.some((s) => s._id === song._id)) {
      const updated = [...songs, song];
      setSongs(updated);
      setQueue(updated);
      setShowAddMenu(false);
    }
  };

  // 🗑 Remove Song
  const handleRemoveSong = (songId) => {
    const updated = songs.filter((s) => s._id !== songId);
    setSongs(updated);
    setQueue(updated);
    if (current?._id === songId) {
      setCurrent(null);
      setIsPlaying(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f9fb, #e9eef4)",
        fontFamily: "SF Pro Display, Helvetica Neue, Arial, sans-serif",
        padding: "2.5rem",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <ArrowLeft
            size={24}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/playlists")}
          />
          <h1 style={{ fontWeight: 700, color: "#111" }}>
            {playlist?.name || "Playlist"}
          </h1>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={handlePlayAll}
            style={{
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.1rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              boxShadow: "0 3px 8px rgba(0, 112, 243, 0.2)",
            }}
          >
            <Play size={18} />
            Play All
          </button>

          <button
            onClick={() => setLoop((prev) => !prev)}
            style={{
              background: loop ? "#0070f3" : "white",
              color: loop ? "white" : "#0070f3",
              border: "1px solid #0070f3",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
            }}
            title="Loop playlist"
          >
            <Repeat size={20} />
          </button>

          <button
            onClick={handleShuffle}
            style={{
              background: shuffle ? "#0070f3" : "white",
              color: shuffle ? "white" : "#0070f3",
              border: "1px solid #0070f3",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
            }}
            title="Shuffle"
          >
            <Shuffle size={20} />
          </button>

          <button
            onClick={() => setShowAddMenu(true)}
            style={{
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Plus size={18} /> Add Songs
          </button>
        </div>
      </div>

      {/* Songs List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {songs.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            No songs in this playlist yet.
          </p>
        )}

        {songs.map((song) => (
          <div
            key={song._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "white",
              borderRadius: "12px",
              padding: "0.8rem 1.2rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.01)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={song.coverUrl}
                alt={song.title}
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
              <div>
                <h4 style={{ margin: 0, fontWeight: 600, color: "#111" }}>
                  {song.title}
                </h4>
                <p
                  style={{
                    margin: "0.2rem 0 0",
                    color: "#555",
                    fontSize: "0.9rem",
                  }}
                >
                  {song.artist}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                onClick={() => togglePlay(song)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {current?._id === song._id && isPlaying ? (
                  <Pause size={22} color="#0070f3" />
                ) : (
                  <Play size={22} color="#0070f3" />
                )}
              </button>

              <button
                onClick={() => handleRemoveSong(song._id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={20} color="#e63946" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Songs Popup */}
      {showAddMenu && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowAddMenu(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "2rem",
              maxHeight: "70vh",
              overflowY: "auto",
              width: "400px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#111" }}>
              Add Songs to {playlist?.name}
            </h3>
            {allSongs.map((song) => (
              <div
                key={song._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>{song.title}</span>
                <button
                  onClick={() => handleAddSong(song)}
                  style={{
                    background: "#0070f3",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player */}
      {current && (
        <Player
          song={current}
          queue={queue}
          setQueue={setQueue}
          onChangeSong={setCurrent}
          allSongs={songs}
          loop={loop}
        />
      )}
    </div>
  );
}
