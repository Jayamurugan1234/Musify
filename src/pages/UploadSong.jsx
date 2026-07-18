import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadSong() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!title.trim()) {
      alert("Please enter a song title");
      return;
    }

    if (!file) {
      alert("Please select an audio file");
      return;
    }

    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first");
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("audio_file", file);

      if (imageFile) {
        formData.append("cover_image", imageFile);
      }

      console.log("Uploading song...");

      const res = await axios.post(
        "https://musify-backend-67qs.onrender.com/api/music/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD SUCCESS:", res.data);

      alert("Song uploaded successfully!");

      setTitle("");
      setFile(null);
      setImageFile(null);

      if (audioRef.current) {
        audioRef.current.value = "";
      }

      if (imageRef.current) {
        imageRef.current.value = "";
      }

      // Optional: redirect to Home page
      navigate("/home");

    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      if (err.response) {
        console.log("STATUS:", err.response.status);
        console.log("DATA:", err.response.data);

        alert(
          `Upload Failed (${err.response.status})\n${JSON.stringify(
            err.response.data
          )}`
        );
      } else {
        alert("Server not reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎵 Upload Song</h2>

      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        ref={audioRef}
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Song"}
      </button>
    </div>
  );
}

export default UploadSong;
