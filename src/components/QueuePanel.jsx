import { useMusicPlayer } from "../context/MusicPlayerContext";
import "./QueuePanel.css";

function QueuePanel() {
  const {
    queue,
    currentSong,
    playSong,
  } = useMusicPlayer();

  if (!queue || queue.length === 0) return null;

  return (
    <div className="queue-panel">

      <h3>▶ Up Next</h3>

      {queue.map((song, index) => {
        const isActive = currentSong?.id === song.id;

        return (
          <div
            key={song.id}
            className={`queue-item ${isActive ? "active" : ""}`}
            onClick={() => playSong(song, queue)}
          >
            <img src={song.cover_image} alt="" />

            <div>
              <p className="title">{song.title}</p>
              <p className="artist">
                {song.artist || "Unknown"}
              </p>
            </div>

            <span className="index">{index + 1}</span>
          </div>
        );
      })}

    </div>
  );
}

export default QueuePanel;