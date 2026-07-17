import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [genre, setGenre] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [recent, setRecent] = useState([]);

  const navigate = useNavigate();

  // ================= PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/accounts/profile/");
      const data = res.data;

      setProfile(data);
      setUsername(data.username);
      setBio(data.bio || "");
      setGenre(data.favorite_genre || "");
      setPreview(data.profile_image);

      if (data.username) {
        fetchFollowers(data.username);
        fetchFollowing(data.username);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= PLAYLISTS =================
  const fetchPlaylists = async () => {
    try {
      const res = await axios.get("/api/playlists/");
      setPlaylists(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LIKED SONGS =================
  const fetchLikedSongs = async () => {
    try {
      const res = await axios.get("/api/music/liked/");
      setLikedSongs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FOLLOWERS =================
  const fetchFollowers = async (username) => {
    try {
      const res = await axios.get(
        `/api/accounts/followers/${username}/`
      );
      setFollowers(res.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFollowing = async (username) => {
    try {
      const res = await axios.get(
        `/api/accounts/following/${username}/`
      );
      setFollowing(res.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LISTS =================
  const fetchFollowersList = async () => {
    try {
      const res = await axios.get(
        `/api/accounts/followers/${profile.username}/`
      );
      setFollowersList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFollowingList = async () => {
    try {
      const res = await axios.get(
        `/api/accounts/following/${profile.username}/`
      );
      setFollowingList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= RECENT =================
  const fetchRecent = async () => {
    try {
      const res = await axios.get("/api/music/history/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      setRecent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchProfile();
    fetchPlaylists();
    fetchLikedSongs();
    fetchRecent();
  }, []);

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= SAVE PROFILE =================
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("favorite_genre", genre);

    if (imageFile) {
      formData.append("profile_image", imageFile);
    }

    try {
      await axios.patch("/api/accounts/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="profile">

      {/* HERO */}
      <div className="profile-hero"></div>

      <div className="profile-container">

        <div className="profile-top">

          {/* AVATAR */}
          <div className="avatar-wrap">
            <img
              src={preview || "/default.jpg"}
              className="avatar"
              alt="profile"
            />

            {editMode && (
              <input type="file" onChange={handleImageChange} />
            )}
          </div>

          {/* INFO */}
          <div className="profile-info">

            {!editMode ? (
              <>
                <p className="label">PROFILE</p>
                <h1 className="name">{profile.username}</h1>

                <p className="bio">{profile.bio || "No bio yet"}</p>

                <p className="genre">
                  🎧 {profile.favorite_genre || "No genre"}
                </p>

                {/* STATS */}
                <div className="stats">

                  <div
                    className="stat-box clickable"
                    onClick={() => {
                      setShowFollowers(true);
                      fetchFollowersList();
                    }}
                  >
                    <h3>{followers}</h3>
                    <p>Followers</p>
                  </div>

                  <div
                    className="stat-box clickable"
                    onClick={() => {
                      setShowFollowing(true);
                      fetchFollowingList();
                    }}
                  >
                    <h3>{following}</h3>
                    <p>Following</p>
                  </div>

                </div>

                <button
                  className="primary-btn"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <input
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <input
                  className="input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />

                <input
                  className="input"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />

                <div className="btn-row">
                  <button className="primary-btn" onClick={handleSave}>
                    Save
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

        {/* GRID */}
        <div className="grid">

          {/* PLAYLISTS */}
          <div className="card">
            <h2>🎵 My Playlists</h2>
            {playlists.length === 0 ? (
              <p>No playlists yet</p>
            ) : (
              playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="playlist-item"
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                >
                  🎧 {pl.name}
                </div>
              ))
            )}
          </div>

          {/* LIKED SONGS */}
          <div className="card">
            <h2>❤️ Liked Songs</h2>
            {likedSongs.length === 0 ? (
              <p>No liked songs</p>
            ) : (
              likedSongs.map((song) => (
                <div key={song.id} className="playlist-item">
                  🎵 {song.title}
                </div>
              ))
            )}
          </div>

          {/* RECENTLY PLAYED */}
          <div className="card">
            <h2>⏱ Recently Played</h2>

            {recent.length === 0 ? (
              <p>No recent songs</p>
            ) : (
              recent.map((item) => (
                <div key={item.id} className="playlist-item">
                  🎵 {item.song?.title}
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* MODALS */}
      {showFollowers && (
        <div className="modal">
          <div className="modal-box">
            <h2>Followers</h2>

            {followersList.map((user, i) => (
              <p key={i}>👤 {user}</p>
            ))}

            <button onClick={() => setShowFollowers(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showFollowing && (
        <div className="modal">
          <div className="modal-box">
            <h2>Following</h2>

            {followingList.map((user, i) => (
              <p key={i}>🎧 {user}</p>
            ))}

            <button onClick={() => setShowFollowing(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;