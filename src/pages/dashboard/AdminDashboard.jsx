import { useEffect, useState, useRef, } from "react";
import axios from "axios";
import api from "../../api/axios";
import "./AdminDashboard.css";
import { useMusicPlayer } from "../../Context/MusicPlayerContext";



function AdminDashboard() {
  const [data, setData] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistSongs, setArtistSongs] = useState([]);
  const [playingSongId, setPlayingSongId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [topUsers, setTopUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSongs, setUserSongs] = useState([]);


  const {
    playSong,
    togglePlay,
    isPlaying,
    currentSong,
  } = useMusicPlayer();

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username") || "Admin";

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/music/admin/dashboard/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTopSongs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/music/admin/top-songs/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTopSongs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTopUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/music/admin/top-users/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("TOP USERS RESPONSE:", res.data);

      setTopUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTopArtists = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/music/admin/top-artists/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTopArtists(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredArtists = topArtists.filter((artist) =>
    artist.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSongs = artistSongs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = topUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleArtistClick = async (artistId) => {
    if (selectedArtist === artistId) {
      setSelectedArtist(null);
      setArtistSongs([]);
      return;
    }

    try {
      const res = await api.get(
        `/music/admin/artist-songs/${artistId}/`
      );

      setSelectedArtist(artistId);
      setArtistSongs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserClick = async (userId) => {
    if (selectedUser === userId) {
      setSelectedUser(null);
      setUserSongs([]);
      return;
    }

    try {
      const res = await api.get(
        `/accounts/admin/user-history/${userId}/`
      );

      setSelectedUser(userId);
      setUserSongs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePlaySong = async (song, songList) => {
    try {
      if (playingSongId === song.id) {
        togglePlay();
        return;
      }

      await playSong(song, songList);
      setPlayingSongId(song.id);

    } catch (err) {
      console.log(err);
    }
  };

  const editSong = async (songId) => {
    const newTitle = prompt("Enter new song title");

    if (!newTitle) return;

    try {
      await api.put(
        `/music/song/update/${songId}/`,
        {
          title: newTitle,
        }
      );

      fetchTopSongs();

      if (selectedArtist) {
        handleArtistClick(selectedArtist);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const deleteSong = async (songId) => {
    if (!window.confirm("Delete song?")) return;

    try {
      await api.delete(
        `/music/song/delete/${songId}/`
      );

      fetchTopSongs();

      if (selectedArtist) {
        handleArtistClick(selectedArtist);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchDashboard();
    fetchTopSongs();
    fetchTopArtists();
    fetchTopUsers();
  }, []);

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

  if (!data) {
    return <h2>Loading Admin Dashboard...</h2>;
  }

  return (
    <div className="admin-dashboard">

      <div className="admin-header">

        <div className="admin-title">
          🎵 Musify
        </div>

        <div className="admin-dash"> Admin Dashboard</div>

        <div className="admin-right">

          {/* SEARCH (optional if you already added) */}
          <input
            className="admin-search"
            type="text"
            placeholder="Search songs, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* ADMIN PROFILE */}
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

      <div className="stats">

        <div className="card">
          <h2>{data.total_users}</h2>
          <p>Users</p>
        </div>

        <div className="card">
          <h2>{data.total_songs}</h2>
          <p>Songs</p>
        </div>

        <div className="card">
          <h2>{data.total_artists}</h2>
          <p>Artists</p>
        </div>

        <div className="card">
          <h2>{data.total_streams}</h2>
          <p>Streams</p>
        </div>

      </div>

      <div className="admin-section">
        <h2>🎤 Top Artists</h2>

        {topArtists.length === 0 ? (
          <p>No artists found</p>
        ) : (
          filteredArtists.map((artist) => (
            <div key={artist.id} className="artist-block">

              {/* Artist row */}
              <div
                className="admin-row"
                onClick={() => handleArtistClick(artist.id)}
              >
                🎧 {artist.artist}
              </div>

              {/* Songs (toggle section) */}
              {selectedArtist === artist.id && (
                <div className="admin-artist-songs">

                  {artistSongs.length === 0 ? (
                    <p>No songs uploaded</p>
                  ) : (
                    filteredSongs.map((song) => (
                      <div key={song.id} className="admin-song-row">

                        <div className="admin-song-info">
                          🎵 {song.title}
                        </div>

                        <div className="admin-song-actions">

                          <button
                            className="play-btn"
                            onClick={() =>
                              handlePlaySong(song, artistSongs)
                            }
                          >
                            {playingSongId === song.id ? "⏸" : "▶"}
                          </button>

                          <button onClick={() => editSong(song.id)}>
                            ✏
                          </button>

                          <button onClick={() => deleteSong(song.id)}>
                            🗑
                          </button>

                        </div>

                      </div>
                    ))
                  )}

                </div>
              )}

            </div>
          ))
        )}

        <div className="admin-section">
          <h2>👤 Top Users</h2>

          {filteredUsers.length === 0 ? (
            <p>No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="artist-block">

                {/* USER ROW */}
                <div
                  className="admin-row"
                  onClick={() => handleUserClick(user.id)}
                >
                  👤 {user.username}
                </div>

                {/* USER DETAILS (expand section) */}
                {selectedUser === user.id && (
                  <div className="admin-artist-songs">

                    {userSongs.length === 0 ? (
                      <p>No activity found</p>
                    ) : (
                      userSongs.map((song) => (
                        <div key={song.id} className="admin-song-row">

                          <div className="admin-song-info">
                            🎵 {song.title}
                          </div>

                        </div>
                      ))
                    )}

                  </div>
                )}

              </div>
            ))
          )}
        </div>

      </div>

      {/* Player is now rendered globally in App.jsx via <MusicPlayer /> */}

    </div>
  );
}

export default AdminDashboard;
