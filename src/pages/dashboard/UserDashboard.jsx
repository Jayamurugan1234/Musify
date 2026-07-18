import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./UserDashboard.css";
import { useMusicPlayer } from "../../Context/MusicPlayerContext";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openPlaylistId, setOpenPlaylistId] = useState(null);

  const dropdownRef = useRef(null);

  const username = localStorage.getItem("username") || "User";
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("token");

  const navigate = useNavigate();

  const {
    playSong,
    togglePlay,
    isPlaying,
    currentSong,
    toggleLike,
  } = useMusicPlayer();

  // ================= FETCH SONGS =================
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(
          "https://musify-backend-67qs.onrender.com/api/music/songs/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSongs(res.data);
        setFilteredSongs(res.data);
      } catch (err) {
        console.log("songs error:", err.response?.data);
      }
    };

    fetchSongs();
  }, []);

  // ================= FETCH PLAYLISTS =================
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(
          "https://musify-backend-67qs.onrender.com/api/playlists/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlaylists(res.data);
      } catch (err) {
        console.log("playlist error:", err.response?.data);
      }
    };

    fetchPlaylists();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSongs(filtered);
  }, [search, songs]);

  // ================= CLOSE OUTSIDE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if the click is inside the "Add to Playlist" dropdown —
      // otherwise mousedown removes it from the DOM before the click/onClick
      // event fires on the playlist item.
      if (e.target.closest(".playlist-wrapper")) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setOpenPlaylistId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ================= PLAY / PAUSE =================
  const handlePlay = (song) => {
    const isSameSong = currentSong?.id === song.id;

    if (isSameSong) {
      togglePlay();
    } else {
      playSong(song, filteredSongs);
    }
  };

  const addToPlaylist = async (playlistId, songId) => {
    console.log("🔥 FUNCTION CALLED");
    console.log("PLAYLIST ID:", playlistId);
    console.log("SONG ID:", songId);

    try {
      const url = `https://musify-backend-67qs.onrender.com/api/playlists/${playlistId}/add-song/`;

      const res = await axios.post(
        url,
        { song_id: songId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SUCCESS:", res.data);
      alert(res.data.message);

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed");
    }
  };
  console.log("ACCESS TOKEN:", token);
  console.log("ACCESS TOKEN:", localStorage.getItem("access"));

  return (
    <div className="dashboard">

      {/* ================= TOP BAR ================= */}
      <div className="topbar">

        <h2>🎵 Musify</h2>

        <input
          className="search"
          placeholder="Search songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="topbar-right">

          <button
            className="playlist-btn"
            onClick={() => navigate("/favorites")}
          >
            Favorites
          </button>

          <button
            className="playlist-btn"
            onClick={() => navigate("/playlists")}
          >
            🎵 My Playlist
          </button>

          {/* USER MENU */}
          <div className="user-menu" ref={dropdownRef}>

            <div
              className="avatar"
              onClick={() => setDropdownOpen((p) => !p)}
            >
              {username.charAt(0).toUpperCase()}
            </div>

            {dropdownOpen && (
              <div className="dropdown">
                <p className="username">
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

      {/* ================= SONG LIST ================= */}
      <div className="song-list">

        {filteredSongs.map((song) => {
          const isActive = currentSong?.id === song.id;

          return (
            <div key={song.id} className="song-card">

              <img src={song.cover_image} alt="" />

              <div className="song-info">
                <h4>{song.title}</h4>
                <p>{song.artist_name || `Artist #${song.artist}`}</p>
              </div>

              <div className="song-actions">

                {/* PLAY / PAUSE */}
                <button id="play-btn" onClick={() => handlePlay(song)}>
                  {isActive && isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>

                {/* LIKE */}
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.post(
                        `https://musify-backend-67qs.onrender.com/api/music/songs/${song.id}/like/`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      alert(res.data.message); // ✅ show backend message
                    } catch (err) {
                      alert(
                        err.response?.data?.message ||
                        "Something went wrong"
                      );
                    }
                  }}
                >
                  ❤️ Like
                </button>

                {/* PLAYLIST DROPDOWN */}
                <div className="playlist-wrapper">

                  <button
                    className="playlist-btn"
                    onClick={() =>
                      setOpenPlaylistId(openPlaylistId === song.id ? null : song.id)
                    }
                  >
                    ➕ Add Playlist
                  </button>

                  {openPlaylistId === song.id && (
                    <div className="playlist-dropdown-menu">

                      {playlists.length === 0 ? (
                        <p>No playlists</p>
                      ) : (
                        playlists.map((p) => (
                          <div
                            key={p.id}
                            className="playlist-item"
                            onClick={() => {
                              // alert("CLICK WORKING");

                              console.log("🔥 CLICKED ADD PLAYLIST");
                              console.log("playlist:", p.id);
                              console.log("song:", song.id);

                              addToPlaylist(p.id, song.id);

                              setOpenPlaylistId(null);
                            }}
                          >
                            🎵 {p.name}
                          </div>
                        ))
                      )}

                    </div>
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Player is now rendered globally in App.jsx via <MusicPlayer /> */}

    </div>
  );
}

export default UserDashboard;

