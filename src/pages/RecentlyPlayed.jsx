import { useEffect, useState } from "react";
import axios from "axios";

function RecentlyPlayed() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await axios.get(
        "https://musify-backend-67qs.onrender.com/api/music/history/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(res.data);
    } catch (error) {
      console.error(
        "History Error:",
        error.response?.data || error
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recently Played</h1>

      {history.length === 0 ? (
        <p>No recently played songs.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <h3>{item.song?.title}</h3>
          </div>
        ))
      )}
    </div>
  );
}

export default RecentlyPlayed;
