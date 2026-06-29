import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import api from "../utils/api";
import Player from "../components/Player";
import artistsData from "../data/artistsData";

export default function ArtistPage() {
  const { artistName } = useParams();
  const decodedName = decodeURIComponent(artistName);

  const [songs, setSongs] = useState([]);
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function fetchArtistData() {
      try {
        // ✅ Prefer songsData from Library cache
        let allSongs = [];
        const cached = localStorage.getItem("songsData");

        if (cached) {
          allSongs = JSON.parse(cached);
        } else {
          // fallback fetch if cache empty
          const { data } = await api.get("/songs");
          allSongs = Array.isArray(data) ? data : [];
          // sanitize artist field
          allSongs = allSongs.map((s) => ({
            ...s,
            artist: s.artist?.trim() || "Unknown Artist",
          }));
          localStorage.setItem("songsData", JSON.stringify(allSongs));
        }

        // ✅ Filter songs by *real artist name* (case-insensitive)
        const artistSongs = allSongs.filter(
          (song) =>
            song.artist?.toLowerCase().trim() ===
            decodedName.toLowerCase().trim()
        );

        setSongs(artistSongs);

        // Build faux albums (optional aesthetic)
        const fakeAlbums = [];
        const albumCount = Math.min(3, Math.ceil(artistSongs.length / 5));
        for (let i = 0; i < albumCount; i++) {
          const slice = artistSongs.slice(i * 5, i * 5 + 5);
          if (slice.length) {
            fakeAlbums.push({
              title: `${decodedName} Vol. ${i + 1}`,
              cover: slice[0]?.coverUrl,
              songs: slice,
            });
          }
        }
        setAlbums(fakeAlbums);
      } catch (err) {
        console.error("Error loading artist songs:", err);
      }
    }

    // ✅ Try to find artist profile from artistsData
    const foundArtist =
      artistsData.find(
        (a) => a.name.toLowerCase() === decodedName.toLowerCase()
      ) ||
      {
        name: decodedName,
        image:
          "https://via.placeholder.com/300x300?text=" +
          encodeURIComponent(decodedName),
        bio: `${decodedName} — artist profile`,
      };

    setArtist(foundArtist);
    fetchArtistData();
  }, [decodedName]);

  const playAll = () => {
    if (songs.length) {
      setQueue(songs);
      setCurrent(songs[0]);
    }
  };

  if (!artist) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "SF Pro Display, Helvetica Neue, Arial, sans-serif",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#555" }}>Artist not found.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,rgb(225, 230, 236), #e9eef4)",
        fontFamily: "SF Pro Display, Helvetica Neue, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "140px",
        boxSizing: "border-box",
      }}
    >
      {/* Banner */}
      <div
        style={{
          width: "100%",
          backgroundImage: `linear-gradient(rgba(248, 242, 242, 0.25), rgba(246, 238, 238, 0.15)), url(${artist.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "360px",
          borderBottomLeftRadius: "40px",
          borderBottomRightRadius: "40px",
          boxShadow: "inset 0 -60px 60px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          color: "white",
          textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        {/* Back Button */}
        <Link
          to="/library"
          style={{
            position: "absolute",
            top: "1.5rem",
            left: "2rem",
            color: "white",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          ← Back
        </Link>

        {/* Artist Image */}
        <img
          src={artist.image}
          alt={artist.name}
          style={{
            width: "180px",                // slightly bigger for full impact
            height: "180px",
            borderRadius: "50%",
            objectFit: "contain",          // show entire image
            backgroundColor: "rgba(255,255,255,0.15)", // gentle halo if pic isn’t a perfect square
            border: "3px solid rgba(255,255,255,0.7)",
            marginBottom: "1rem",
            padding: "4px",                // gives air between edge and border
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          }}
        />

        {/* Artist Name */}
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          {artist.name}
        </h1>

        {/* Bio */}
        <p
          style={{
            fontSize: "1rem",
            color: "#111",
            background: "#a3afc8",
            borderRadius: "10px",
            padding: "0.8rem 1rem",
            maxWidth: "700px",
            textAlign: "center",
            marginBottom: "2rem",
            lineHeight: "1.6",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {artist.bio}
        </p>

        {/* Play All Button */}
        <button
          onClick={playAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "#a3afc8",
            color: "#111",
            fontWeight: "600",
            fontSize: "1rem",
            border: "none",
            borderRadius: "30px",
            padding: "0.7rem 1.5rem",
            marginBottom: "2rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Play size={20} color="#111" />
          Play All
        </button>
      </div>

      {/* Popular Songs */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          marginTop: "3rem",
          padding: "0 2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            color: "#111",
          }}
        >
          Popular Songs
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2.5rem",
          }}
        >
          {songs.length > 0 ? (
            songs.map((song) => (
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
                  width: "320px",
                  height: "110px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
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
                onClick={() => {
                  setCurrent(song);
                  setQueue(songs);
                }}
              >
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
                    {artist.name}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#666", fontSize: "1rem" }}>
              No songs available for this artist yet.
            </p>
          )}
        </div>
      </div>

      {/* Albums */}
      {albums.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            marginTop: "4rem",
            padding: "0 2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: "#111",
            }}
          >
            Albums
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2.5rem",
            }}
          >
            {albums.map((album, i) => (
              <div
                key={i}
                style={{
                  width: "220px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setQueue(album.songs);
                  setCurrent(album.songs[0]);
                }}
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  style={{
                    width: "220px",
                    height: "220px",
                    borderRadius: "16px",
                    objectFit: "cover",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
                  }}
                />
                <p
                  style={{
                    marginTop: "0.8rem",
                    fontWeight: "600",
                    color: "#111",
                  }}
                >
                  {album.title}
                </p>
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
        />
      )}
    </div>
  );
}
