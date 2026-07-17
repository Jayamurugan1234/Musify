import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Playlists.css";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const username = localStorage.getItem("username") || "User";
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // ✅ FIXED
  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/playlists/");
      setPlaylists(res.data);
      console.log(res.data)
    } catch (error) {
      console.log("FETCH ERROR:", error);
    }
  };

  // ✅ FIXED
  const createPlaylist = async () => {
  if (!playlistName.trim()) {
    alert("Enter playlist name");
    return;
  }

  try {
    const res = await api.post("/playlists/", {
      name: playlistName.trim(),
    });

    console.log("PLAYLIST CREATED:", res.data);

    setPlaylistName("");
    fetchPlaylists();
  } catch (err) {
    console.log("CREATE ERROR:", err);
    console.log("RESPONSE:", err.response?.data);

    alert(
      JSON.stringify(err.response?.data || "Playlist creation failed")
    );
  }
};

  const deletePlaylist = async (id) => {
    try {
      await api.delete(`/playlists/${id}/delete/`);
      fetchPlaylists();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="playlist-page">

      <div className="topbar">
        <h2>🎵 Musify</h2>

        <input
          className="search"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="playy-topbar-right">

          <button
            className="playlist-btn"
            onClick={() => navigate("/favorites")}
          >
             Favorites
          </button>

          <button
            className="playlist-btn1"
            onClick={() => navigate("/user")}
          >
             Home
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
                <button onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}>
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* CREATE */}
      <div className="create-playlist-box">
        <input
          placeholder="Create new playlist..."
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />

        <button onClick={createPlaylist}>
          + Create
        </button>
      </div>

      {/* LIST */}
      <div className="playlist-grid">

        {playlists
          .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
          .map((playlist) => (
            <div key={playlist.id} className="playlist-card">

              <div
                className="playlist-info"
                onClick={() => navigate(`/playlists/${playlist.id}`)}
              >
                <h3>🎵 {playlist.name}</h3>
                <p>{playlist.playlist_songs?.length || 0} songs</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => deletePlaylist(playlist.id)}
              >
                ❌
              </button>

            </div>
          ))}
      </div>

    </div>
  );
}

export default Playlists;