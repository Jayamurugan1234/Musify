import { useState } from "react";
import api from "../api/axios";
import "./BulkUpload.css";

function BulkUpload() {
    const [title, setTitle] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!title || !audioFile) {
            alert("Title and audio file required");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("audio_file", audioFile);
            formData.append("cover_image", coverImage);

            const res = await api.post("/music/upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Upload success:", res.data);
            alert("Song uploaded successfully!");

            setTitle("");
            setAudioFile(null);
            setCoverImage(null);
        } catch (err) {
            //   console.log(err.response?.data || err);
            //   alert("Upload failed");
            console.log("FULL ERROR:", err);
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);

            alert("Upload failed");



        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <h2 className="upload-title">Upload Song</h2>

            <input
                type="text"
                placeholder="Song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="upload-input"
            />

            <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                className="upload-input"
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="upload-input"
            />

            <button
                onClick={handleUpload}
                className="upload-button"
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload Song"}
            </button>
        </div>
    );
}

export default BulkUpload;
