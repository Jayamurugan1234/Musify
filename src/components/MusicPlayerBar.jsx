import { useMusicPlayer } from "../context/MusicPlayerContext";

function MusicPlayerBar() {
  const { currentSong, isPlaying, togglePlay } = useMusicPlayer();

  if (!currentSong) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#111",
        color: "#fff",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <strong>{currentSong.title}</strong>
      </div>

      <button onClick={togglePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}

export default MusicPlayerBar;