import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { useMusicPlayer } from "../Context/MusicPlayerContext";

function Home() {
  const [songs, setSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // ⭐ NEW
  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);

  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    previousSong,
    progress,
    duration,
    seekTo,
    volume,
    changeVolume,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = useMusicPlayer();

  // ================= SONGS =================
  const fetchSongs = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await axios.get(
        "http://localhost:8000/api/music/songs/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSongs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= PLAYLISTS =================
  const fetchPlaylists = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await axios.get(
        "http://localhost:8000/api/playlists/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlaylists(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= LIKES =================
  const fetchLikedSongs = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await axios.get(
        "http://localhost:8000/api/music/liked/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLikedSongs(res.data.map((song) => song.id));
    } catch (error) {
      console.log(error);
    }
  };

  // ================= ⭐ RECOMMENDATIONS =================
  const fetchRecommendations = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await axios.get(
        "http://localhost:8000/api/music/recommendations/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRecommended(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= 🔥 TRENDING =================
  const fetchTrending = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await axios.get(
        "http://localhost:8000/api/music/trending-recommendation/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTrending(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
    fetchLikedSongs();
    fetchRecommendations(); // ⭐ NEW
    fetchTrending(); // 🔥 NEW
  }, []);

  // ================= LIKE =================
  const likeSong = async (songId) => {
    const token = localStorage.getItem("access");

    await axios.post(
      `http://localhost:8000/api/music/songs/${songId}/like/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setLikedSongs((prev) => [...prev, songId]);
  };

  // ================= UNLIKE =================
  const unlikeSong = async (songId) => {
    const token = localStorage.getItem("access");

    await axios.post(
      `http://localhost:8000/api/music/songs/${songId}/unlike/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setLikedSongs((prev) =>
      prev.filter((id) => id !== songId)
    );
  };

  // ================= ADD TO PLAYLIST =================
  const addToPlaylist = async (playlistId, songId) => {
    const token = localStorage.getItem("access");

    await axios.post(
      `http://localhost:8000/api/playlists/${playlistId}/add-song/`,
      { song_id: songId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Added to playlist");
  };

  // ================= FORMAT TIME =================
  const formatTime = (time) => {
    if (!time) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="home">

      <h1>🎵 Musify</h1>

      {/* ⭐ RECOMMENDED */}
      <div className="card">
        <h2>🔥 Recommended for You</h2>

        {recommended.length === 0 ? (
          <p>No recommendations yet</p>
        ) : (
          recommended.map((song) => (
            <div
              key={song.id}
              className="song-card"
              onClick={() => playSong(song, recommended)}
            >
              🎵 {song.title}
            </div>
          ))
        )}
      </div>

      {/* 🔥 TRENDING */}
      <div className="card">
        <h2>📈 Trending Songs</h2>

        {trending.length === 0 ? (
          <p>No trending songs</p>
        ) : (
          trending.map((song) => (
            <div
              key={song.id}
              className="song-card"
              onClick={() => playSong(song, trending)}
            >
              🎧 {song.title}
            </div>
          ))
        )}
      </div>

      {/* ALL SONGS */}
      <div className="song-list">
        {songs.map((song) => (
          <div key={song.id} className="song-card">

            <div>
              <h3>{song.title}</h3>
              <p>{song.artist_name || `Artist #${song.artist}`}</p>
            </div>

            <div>

              <button onClick={() => playSong(song)}>
                ▶ Play
              </button>

              {likedSongs.includes(song.id) ? (
                <button onClick={() => unlikeSong(song.id)}>
                  💔 Unlike
                </button>
              ) : (
                <button onClick={() => likeSong(song.id)}>
                  ❤️ Like
                </button>
              )}

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addToPlaylist(
                      e.target.value,
                      song.id
                    );
                  }
                }}
              >
                <option value="">Playlist</option>
                {playlists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

            </div>

          </div>
        ))}
      </div>

      {/* PLAYER (UNCHANGED) */}
      <div className="player">
        {currentSong ? (
          <>
            <h3>{currentSong.title}</h3>

            <button onClick={previousSong}>⏮</button>
            <button onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={nextSong}>⏭</button>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress || 0}
              onChange={(e) =>
                seekTo(Number(e.target.value))
              }
            />

            <span>
              {formatTime(progress)} /{" "}
              {formatTime(duration)}
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) =>
                changeVolume(Number(e.target.value))
              }
            />
          </>
        ) : (
          <p>No song selected</p>
        )}
      </div>

    </div>
  );
}

export default Home;