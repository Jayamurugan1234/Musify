import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./Favorites.css";
import { useMusicPlayer } from "../../Context/MusicPlayerContext";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username") || "User";

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const {
    playSong,
    togglePlay,
    currentSong,
    isPlaying,
    nextSong,
    previousSong,
    progress,
    duration,
    seekTo,
    volume,
    changeVolume,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = useMusicPlayer();

  // ================= FETCH FAVORITES =================
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/music/favorites/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSongs(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFavorites();
  }, []);

  // ================= CLOSE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= PLAY =================
  const handlePlay = (song) => {
    const isSame = currentSong?.id === song.id;

    if (isSame) {
      togglePlay();
    } else {
      playSong(song, songs);
    }
  };

  // ================= REMOVE FAVORITE =================
  const removeFavorite = async (songId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/music/songs/${songId}/unlike/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="favorites-container">

      {/* ================= TOPBAR (same as dashboard) ================= */}
      <div className="topbar">
        <h2>🎵 Musify</h2>

        <input
          className="search"
          placeholder="Search favorites..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="topbar-right">
          <button
            className="playlist-btn"
            onClick={() => navigate("/playlists")}
          >
            🎵 My Playlist
          </button>

          <button
            className="playlist-btn"
            onClick={() => navigate("/user")}
          >
            🏠 Home
          </button>

          <div className="user-menu" ref={dropdownRef}>
            <div
              className="avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {username.charAt(0).toUpperCase()}
            </div>

            {dropdownOpen && (
              <div className="dropdown">
                <p className="username">{username.toUpperCase()}</p>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= SONG LIST (FILTER FIXED HERE) ================= */}
      {songs.filter((song) =>
        song.title.toLowerCase().includes(search.toLowerCase())
      ).length === 0 ? (
        <div className="no-favorites">No favorite songs found</div>
      ) : (
        songs
          .filter((song) =>
            song.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((song) => {
            const isActive = currentSong?.id === song.id;

            return (
              <div key={song.id} className="favorite-song-card">

                <div className="favorite-left">
                  <img
                    src={
                      song.cover_image?.startsWith("http")
                        ? song.cover_image
                        : `http://localhost:8000${song.cover_image}`
                    }
                    alt=""
                    className="favorite-cover"
                  />

                  <div className="favorite-info">
                    <h3>{song.title}</h3>
                    <p>Artist #{song.artist}</p>
                  </div>
                </div>

                <div className="favorite-actions">
                  <button
                    className="fav-play-btn"
                    onClick={() => handlePlay(song)}
                  >
                    {isActive && isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFavorite(song.id)}
                >
                  ❌ Remove
                </button>
              </div>
            );
          })
      )}

      {/* ================= PLAYER (same logic as dashboard) ================= */}
      {currentSong && (
        <div className="fav-music-player">

          <div className="fav-player-left">
            <img
              src={currentSong.cover_image}
              className="fav-player-cover"
              alt=""
            />
            <div>
              <h4>{currentSong.title}</h4>
              <p>Artist #{currentSong.artist}</p>
            </div>
          </div>

          <div className="fav-player-center">

            <div className="fav-player-controls">
              <button onClick={toggleShuffle}>🔀</button>
              <button onClick={previousSong}>⏮</button>

              <button className="fav-main-play-btn" onClick={togglePlay}>
                {isPlaying ? "⏸" : "▶"}
              </button>

              <button onClick={nextSong}>⏭</button>
              <button onClick={toggleRepeat}>
                {repeatMode === "one" ? "🔂" : "🔁"}
              </button>
            </div>

            <div className="fav-progress-area">
              <span>
                {Math.floor(progress / 60)}:
                {String(Math.floor(progress % 60)).padStart(2, "0")}
              </span>

              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="fav-progress-bar"
              />

              <span>
                {Math.floor(duration / 60)}:
                {String(Math.floor(duration % 60)).padStart(2, "0")}
              </span>
            </div>

          </div>

          <div className="fav-player-right">
            🔊

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
            />
          </div>

        </div>
      )}

    </div>
  );
}

export default Favorites;