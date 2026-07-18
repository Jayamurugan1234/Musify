import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ArtistDashboard.css";
import { useMusicPlayer } from "../../Context/MusicPlayerContext";

function ArtistDashboard() {
  const [data, setData] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [recent, setRecent] = useState([]);
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(""); 

  const audioRef = useRef(null);

  const {
    playSong,
    togglePlay,
    isPlaying,
    currentSong,
  } = useMusicPlayer();

  const token = localStorage.getItem("access");

  const uploadSong = async () => {
    if (!title || !audio) {
      alert("Please add a song title and choose an audio file");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("audio_file", audio);
    formData.append("cover_image", image); // sent as a plain URL string

    try {
      await axios.post(
        "https://musify-backend-67qs.onrender.com/api/music/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Song Uploaded Successfully 🎉");

      setTitle("");
      setAudio(null);
      setImage("");
      if (audioRef.current) {
        audioRef.current.value = "";
      }

      fetchDashboard();
      fetchTopSongs();
      fetchRecent();
    } catch (err) {
      console.log("Upload error response:", err.response?.data);
      alert("Upload Failed: " + JSON.stringify(err.response?.data));
    }
  };

  // 📊 DASHBOARD
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "https://musify-backend-67qs.onrender.com/api/music/artist/dashboard/",
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

  // 🔥 TOP SONGS
  const fetchTopSongs = async () => {
    try {
      const res = await axios.get(
        "https://musify-backend-67qs.onrender.com/api/music/artist/top-songs/",
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

  const deleteSong = async (songId) => {
    try {
      await axios.delete(
        `https://musify-backend-67qs.onrender.com/api/music/songs/${songId}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // STOP PLAYER IF DELETED SONG IS PLAYING
      if (currentSong?.id === songId) {
        const audio = document.querySelector("audio");

        if (audio) {
          audio.pause();
          audio.src = "";
        }
      }

      fetchTopSongs();
      fetchRecent();
      fetchDashboard();

      alert("Song deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };
  // 🆕 RECENT UPLOADS
  const fetchRecent = async () => {
    try {
      const res = await axios.get(
        "https://musify-backend-67qs.onrender.com/api/music/artist/recent-uploads/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchTopSongs();
    fetchRecent();
  }, []);

  if (!data) {
    return <h2>Loading Artist Dashboard...</h2>;
  }

  return (
    <div className="artist-dashboard">

      <h1>🎤 Artist Dashboard</h1>

      <div className="top-section">

        {/* UPLOAD SONG */}
        <div className="upload-box">

          <h2>🎵 Upload New Song</h2>

          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Styled audio file picker with visible placeholder */}
          <label className="file-input-wrapper">
            <span className="file-input-btn">Choose Audio</span>
            <span className="file-input-name">
              {audio ? audio.name : "No audio file chosen"}
            </span>
            <input
              ref={audioRef}
              type="file"
              accept="audio/*"
              className="file-input-hidden"
              onChange={(e) => setAudio(e.target.files[0])}
            />
          </label>

          {/* Cover image is a pasted URL, not a file upload */}
          <input
            type="url"
            placeholder="Cover image URL (https://...)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button onClick={uploadSong}>
            Upload Song
          </button>

        </div>

        {/* STATS */}
        <div className="stats">

          <div className="card">
            <h2>{data.artist}</h2>
            <p>Artist Name</p>
          </div>

          <div className="card">
            <h2>{data.total_songs}</h2>
            <p>Total Songs</p>
          </div>

          <div className="card">
            <h2>{data.total_plays}</h2>
            <p>Total Plays</p>
          </div>

          <div className="card">
            <h2>{data.followers}</h2>
            <p>Followers</p>
          </div>

        </div>

      </div>

      {/* TOP SONGS */}
      <div className="section">

        <h2>🔥 Top Songs</h2>

        {topSongs.length === 0 ? (
          <p>No songs yet</p>
        ) : (
          topSongs.map((song) => (
            <div key={song.id} className="row">

              <span>
                🎵 {song.title} — {song.plays || 0} plays
              </span>

              <div className="song-actions">

                <button className="song-ply-btn"
                  onClick={() => {
                    const isSameSong = currentSong?.id === song.id;

                    if (isSameSong) {
                      togglePlay();
                    } else {
                      playSong(song, recent);
                    }
                  }}
                >
                  {currentSong?.id === song.id && isPlaying
                    ? "⏸ Pause"
                    : "▶ Play"}
                </button>

                <button className="song-edit-btn"
                  onClick={async () => {
                    const newTitle = prompt(
                      "Enter new song title",
                      song.title
                    );

                    if (!newTitle) return;

                    try {
                      await axios.put(
                        `https://musify-backend-67qs.onrender.com/api/music/songs/${song.id}/update/`,
                        {
                          title: newTitle,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      alert("Song Updated");

                      fetchTopSongs();
                      fetchRecent();

                    } catch (err) {
                      console.log(err);
                      alert("Update Failed");
                    }
                  }}
                >
                  ✏ Edit
                </button>

                <button className="song-del-btn" onClick={() => deleteSong(song.id)}>
                  🗑 Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* RECENT UPLOADS */}
      <div className="section">

        <h2>🆕 Recent Uploads</h2>

        {recent.length === 0 ? (
          <p>No uploads yet</p>
        ) : (
          recent.map((song) => (
            <div key={song.id} className="row">

              <span>
                🎧 {song.title}
              </span>

              <div className="song-actions">

                <button className="song-ply-btn"
                  onClick={() => {
                    const isSameSong = currentSong?.id === song.id;

                    if (isSameSong) {
                      togglePlay();
                    } else {
                      playSong(song, recent);
                    }
                  }}
                >
                  {currentSong?.id === song.id && isPlaying
                    ? "⏸ Pause"
                    : "▶ Play"}
                </button>

                <button className="song-edit-btn"
                  onClick={async () => {
                    const newTitle = prompt(
                      "Enter new song title",
                      song.title
                    );

                    if (!newTitle) return;

                    try {
                      await axios.put(
                        `https://musify-backend-67qs.onrender.com/api/music/songs/${song.id}/update/`,
                        {
                          title: newTitle,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      alert("Song Updated");

                      fetchTopSongs();
                      fetchRecent();

                    } catch (err) {
                      console.log(err);
                      alert("Update Failed");
                    }
                  }}
                >
                  ✏ Edit
                </button>

                <button className="song-del-btn" onClick={() => deleteSong(song.id)}>
                  🗑 Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* Player is now rendered globally in App.jsx via <MusicPlayer /> */}

    </div>
  );
}

export default ArtistDashboard;

