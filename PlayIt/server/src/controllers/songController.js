import Song from "../models/Song.js";
import fs from "fs";

// Get all songs
export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one song by ID
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload a new song
export const uploadSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No song file uploaded" });
    }

    const newSong = await Song.create({
      title,
      artist,
      album,
      genre,
      duration,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a song
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    // Delete file from uploads
    const filePath = `src${song.fileUrl}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await song.deleteOne();
    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search songs by keyword
export const searchSongs = async (req, res) => {
  try {
    const { q } = req.query;
    const songs = await Song.find({
      title: { $regex: q, $options: "i" },
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
