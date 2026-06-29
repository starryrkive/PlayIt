// src/components/Player.js
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Download,
  ListMusic,
  Clock,
  XCircle,
} from "lucide-react";
import { incrementPlayCount } from "../utils/statsUtils";

// The Player component handles playback, queue management, and song transitions
export default function Player({
  song, // currently selected song
  queue = [], // upcoming songs
  setQueue = () => {}, // setter for queue
  onChangeSong = () => {}, // updates the currently playing song
  allSongs = [], // fallback list of all songs (if no queue)
  loop = false, // whether to loop playlist when it ends
}) {
  // --- STATE MANAGEMENT ---
  const [isPlaying, setIsPlaying] = useState(false); // tracks play/pause state
  const [progress, setProgress] = useState(0); // stores playback progress (percentage)
  const [duration, setDuration] = useState(0); // stores total length of current song
  const [showQueue, setShowQueue] = useState(false); // toggles queue visibility
  const [playbackRate, setPlaybackRate] = useState(1); // current playback speed
  const [volume, setVolume] = useState(1); // current volume level (0–1)

  // --- REFS ---
  const audioRef = useRef(null); // reference to the <audio> element for direct control
  const isPlayingRef = useRef(false); // mirror of isPlaying to avoid stale closures
  const countedRef = useRef(false); // ensures play count is only registered once per song

  // Sync the ref with current playback state (used to avoid stale value issues)
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Compute playback order: use queue if available, else use allSongs
  const getOrder = useCallback(
    () => (queue && queue.length ? queue : allSongs || []),
    [queue, allSongs]
  );

  // Find the current song’s position within playback order
  const findIndexInOrder = useCallback(() => {
    const order = getOrder();
    if (!song?._id) return -1; // if no song loaded, return invalid index
    return order.findIndex((s) => s?._id === song._id);
  }, [getOrder, song]);

  // --- WHEN SONG CHANGES ---
  useEffect(() => {
    const audio = audioRef.current;
    countedRef.current = false; // reset play count tracker for new song

    // if no valid audio or song, stop execution
    if (!audio || !song) return;

    // reset progress and duration for the new track
    setProgress(0);
    setDuration(0);

    // stop and reload the new audio source
    audio.pause();
    audio.load();

    // when metadata (like duration) is available
    const handleLoaded = () => {
      const dur = audio.duration;
      if (Number.isFinite(dur)) setDuration(dur); // set duration once ready

      // if user already pressed play before song loaded, start automatically
      if (isPlayingRef.current) {
        audio.playbackRate = playbackRate;
        audio.volume = volume;
        audio.play().catch(() => {}); // catch autoplay restriction errors silently
      }
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    return () => audio.removeEventListener("loadedmetadata", handleLoaded);
  }, [song, playbackRate, volume]);

  // --- HANDLE PLAY/PAUSE CHANGES ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // set playback rate and volume before playing
      audio.playbackRate = playbackRate;
      audio.volume = volume;
      audio.play().catch(() => {}); // browser might block autoplay
    } else {
      // pause playback if state changes to false
      audio.pause();
    }
  }, [isPlaying, playbackRate, volume]);

  // --- COUNT PLAYS ONCE PER SONG ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      // only increment if not counted yet for this song
      if (!countedRef.current && song?._id) {
        countedRef.current = true;
        incrementPlayCount(song._id); // notify backend or analytics
      }
    };

    audio.addEventListener("playing", onPlaying);
    return () => audio.removeEventListener("playing", onPlaying);
  }, [song]);

  // --- WHEN SONG ENDS ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // make sure play count is recorded even if "playing" event never fired
      if (song?._id && !countedRef.current) {
        countedRef.current = true;
        incrementPlayCount(song._id);
      }

      const order = getOrder();
      if (!order.length) return;

      const idx = findIndexInOrder();
      const nextIdx = idx >= 0 ? idx + 1 : 0;

      // move to next track if available
      if (nextIdx < order.length) {
        onChangeSong(order[nextIdx]);
        setIsPlaying(true);
      }
      // loop playlist from start if loop enabled
      else if (loop) {
        onChangeSong(order[0]);
        setIsPlaying(true);
      }
      // stop playback if at end and no loop
      else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [song, getOrder, findIndexInOrder, onChangeSong, loop]);

  // --- BUTTON HANDLERS ---

  // toggles play/pause state
  const handlePlayPause = () => setIsPlaying((p) => !p);

  // updates progress bar as audio time changes
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  // manually seek (scrub) within song
  const handleSeek = (e) => {
    const newProgress = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration) || duration === 0) return;

    const newTime = (newProgress / 100) * duration;
    if (Number.isFinite(newTime)) {
      audio.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  // jump to next track in order
  const handleNext = () => {
    const order = getOrder();
    if (!order.length) return;
    const idx = findIndexInOrder();
    const next = order[(Math.max(idx, 0) + 1) % order.length];
    if (!next) return;
    onChangeSong(next);
    setIsPlaying(true);
  };

  // jump to previous track in order
  const handlePrev = () => {
    const order = getOrder();
    if (!order.length) return;
    const idx = findIndexInOrder();
    const prev = order[(idx - 1 + order.length) % order.length];
    if (!prev) return;
    onChangeSong(prev);
    setIsPlaying(true);
  };

  // clear all songs from queue
  const handleClearQueue = () => {
    setQueue([]);
    setShowQueue(false);
  };

  // construct safe playable file path for song
  const safeSrc = `http://localhost:5001${
    song?.fileUrl?.startsWith("/") ? song.fileUrl : "/" + (song?.fileUrl || "")
  }`;

  return (
    <div
      // main container for player — fixed to bottom of viewport
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        boxShadow: "0 -4px 10px rgba(0,0,0,0.1)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
        pointerEvents: "none", // lets UI behind it remain clickable
      }}
    >
      {/* everything inside is interactive */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "auto", // re-enable clicks for controls
        }}
      >
        {/* LEFT SECTION: SONG INFO */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* displays song cover art or placeholder */}
          {song?.coverUrl ? (
            <img
              src={song.coverUrl}
              alt={song.title}
              style={{ width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "60px", height: "60px", borderRadius: "10px", background: "#eee" }} />
          )}
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>{song?.title || "No Song"}</h4>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>{song?.artist || ""}</p>
          </div>
        </div>

        {/* CENTER SECTION: PLAYBACK CONTROLS */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* previous track button */}
            <SkipBack onClick={handlePrev} style={{ cursor: "pointer" }} />
            {/* play/pause toggle */}
            {isPlaying ? (
              <Pause
                onClick={handlePlayPause}
                size={28}
                color="#0070f3"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <Play
                onClick={handlePlayPause}
                size={28}
                color="#0070f3"
                style={{ cursor: "pointer" }}
              />
            )}
            {/* next track button */}
            <SkipForward onClick={handleNext} style={{ cursor: "pointer" }} />
          </div>

          {/* playback seek bar (updates via handleSeek) */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            style={{ width: "300px", marginTop: "0.5rem", accentColor: "#0070f3", cursor: "pointer" }}
          />
        </div>

        {/* RIGHT SECTION: AUDIO CONTROLS */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* toggle mute/unmute */}
          <Volume2
            onClick={() => setVolume(volume > 0 ? 0 : 1)}
            size={22}
            style={{ cursor: "pointer" }}
            title={volume > 0 ? "Mute" : "Unmute"}
          />

          {/* volume slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const vol = parseFloat(e.target.value);
              setVolume(vol);
              if (audioRef.current) audioRef.current.volume = vol; // instantly apply to audio
            }}
            style={{ width: "100px", accentColor: "#0070f3", cursor: "pointer" }}
          />

          {/* playback speed toggle (1x -> 1.25x -> 1.5x -> back to 1x) */}
          <div
            onClick={() =>
              setPlaybackRate(
                playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1
              )
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
              color: "#0070f3",
              userSelect: "none",
            }}
            title={`Playback speed: ${playbackRate}x`}
          >
            <Clock size={22} />
            <span style={{ fontSize: "0.9rem", fontWeight: "500", minWidth: "28px", textAlign: "center" }}>
              {playbackRate.toFixed(2)}x
            </span>
          </div>

          {/* download button (opens song in new tab) */}
          <Download
            onClick={() => window.open(safeSrc, "_blank")}
            size={22}
            style={{ cursor: "pointer" }}
            title="Download song"
          />

          {/* queue visibility toggle */}
          <ListMusic
            onClick={() => setShowQueue((s) => !s)}
            size={22}
            style={{
              cursor: "pointer",
              color: showQueue ? "#0070f3" : "inherit",
              transition: "color 0.2s ease",
            }}
            title="Show Queue"
          />
        </div>
      </div>

      {/* QUEUE DROPDOWN LIST */}
      {showQueue && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "2rem",
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "10px",
            width: "260px",
            maxHeight: "260px",
            overflowY: "auto",
            padding: "0.5rem",
            zIndex: 2000,
            pointerEvents: "auto",
          }}
        >
          {/* queue header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
              padding: "0 0.5rem",
            }}
          >
            <h4 style={{ margin: 0 }}>Queue ({queue?.length || 0})</h4>

            {/* clear all songs button */}
            {queue?.length > 0 && (
              <XCircle
                size={20}
                color="#e63946"
                style={{ cursor: "pointer" }}
                title="Clear Queue"
                onClick={handleClearQueue}
              />
            )}
          </div>

          {/* list queue songs */}
          {queue?.length ? (
            queue.map((q) => (
              <div
                key={q._id}
                style={{
                  padding: "0.5rem",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onClick={() => {
                  // when song selected from queue
                  onChangeSong(q);
                  setIsPlaying(true);
                }}
              >
                <img
                  src={q.coverUrl}
                  alt={q.title}
                  style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "cover" }}
                />
                <span style={{ fontSize: "0.9rem" }}>{q.title}</span>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                margin: "1rem 0",
                color: "#666",
                fontSize: "0.9rem",
              }}
            >
              Queue is empty
            </p>
          )}
        </div>
      )}

      {/* --- AUDIO ELEMENT: handles actual playback --- */}
      <audio
        ref={audioRef}
        src={safeSrc} // current song file path
        onTimeUpdate={handleTimeUpdate} // sync progress bar as it plays
        onLoadedMetadata={(e) => {
          // when metadata loads, store song duration
          const dur = e.target.duration;
          if (Number.isFinite(dur)) setDuration(dur);
        }}
      />
    </div>
  );
}
