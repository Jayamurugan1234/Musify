import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useMusicPlayer } from "../Context/MusicPlayerContext";
import "./PlaylistDetail.css";

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const {
    playSong,
    togglePlay,
    isPlaying,
    currentSong,

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
    stopSong,
  } = useMusicPlayer();

  // 👉 username from localStorage (adjust if you use auth context)
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      const res = await api.get(`/playlists/${id}/`);
      setPlaylist(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      const res = await api.post(`/playlists/${id}/remove-song/`, {
        song_id: songId,
      });

      console.log("REMOVE SUCCESS:", res.data);
      alert("Song removed successfully");

      fetchPlaylist();
    } catch (err) {
      console.log("REMOVE ERROR:", err.response?.data);

      alert(
        err.response?.data?.message ||
        "Failed to remove song"
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!playlist) {
    return <h2 style={{ color: "white" }}>Loading...</h2>;
  }

  const filteredSongs =
    playlist.playlist_songs?.filter((item) =>
      item.song.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="playlist-page">

      <div className="play-topbar">

        <h2>🎵 Musify</h2>

        <input
          className="play-search"
          placeholder="Search songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="play-topbar-right">

          <button
            className="play-playlist-btn"
            onClick={() => navigate("/favorites")}
          >
            Favorites
          </button>

          <button
            className="play-playlist-btn"
            onClick={() => navigate("/playlists")}
          >
            🎵 My Playlist
          </button>

          {/* USER MENU */}
          <div className="play-user-menu" ref={dropdownRef}>

            <div
              className="play-avatar"
              onClick={() => setDropdownOpen((p) => !p)}
            >
              {username.charAt(0).toUpperCase()}
            </div>

            {dropdownOpen && (
              <div className="play-dropdown">
                <p className="play-username">
                  {username.toUpperCase()}
                </p>

                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="playlist-header">
        <h1>{playlist.name}</h1>
      </div>

      <div className="song-list">

        {filteredSongs.length === 0 ? (
          <h3>No songs in playlist</h3>
        ) : (
          filteredSongs.map((item) => {
            const song = item.song;
            const isActive = currentSong?.id === song.id;

            return (
              <div key={item.id} className="song-card">

                <img
                  src={song.cover_image}
                  alt={song.title}
                  className="song-img"
                />

                <div className="song-info">
                  <h3>{song.title}</h3>
                </div>

                <div className="song-actions">

                  <button
                    onClick={() => {
                      const queue =
                        playlist.playlist_songs.map((i) => i.song);

                      if (isActive) {
                        togglePlay();
                      } else {
                        playSong(song, queue);
                      }
                    }}
                  >
                    {isActive && isPlaying ? "⏸" : "▶"}
                  </button>

                  <button onClick={() => handleRemoveSong(song.id)}>
                    ❌
                  </button>

                </div>
              </div>
            );
          })
        )}

      </div>

      {currentSong && (
        <div className="music-player">

          <div className="player-left">
            <img
              src={
                currentSong.cover_image?.startsWith("http")
                  ? currentSong.cover_image
                  : `https://musify-backend-67qs.onrender.com${currentSong.cover_image}`
              }
              alt={currentSong.title}
              className="player-cover"
            />

            <div className="player-song-details">
              <h4>{currentSong.title}</h4>
              <p>Artist #{currentSong.artist}</p>
            </div>
          </div>

          <div className="player-center">

            <div className="player-controls">

              <button
                className={isShuffle ? "active-btn" : ""}
                onClick={toggleShuffle}
              >
                🔀
              </button>

              <button onClick={previousSong}>
                ⏮
              </button>

              <button
                className="main-play-btn"
                onClick={togglePlay}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              <button onClick={nextSong}>
                ⏭
              </button>

              <button
                className={repeatMode !== "off" ? "active-btn" : ""}
                onClick={toggleRepeat}
              >
                {repeatMode === "one" ? "🔂" : "🔁"}
              </button>

            </div>

            <div className="progress-area">

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
                className="progress-bar"
              />

              <span>
                {Math.floor(duration / 60)}:
                {String(Math.floor(duration % 60)).padStart(2, "0")}
              </span>

            </div>

          </div>

          <div className="player-right">

            <span>🔊</span>

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

          </div>

        </div>
      )}

    </div>
  );
}

export default PlaylistDetail;
