import { useMusicPlayer } from "../context/MusicPlayerContext";
import "./MiniPlayer.css";

function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    progress,
    duration,
    seekTo,
  } = useMusicPlayer();

  const formatTime = (t) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <div className="mini-player">

      <div className="mini-left">
        <img
          src={currentSong.cover_image}
          alt=""
          className="mini-img"
        />

        <div>
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist || "Unknown Artist"}</p>
        </div>
      </div>

      <div className="mini-center">

        <button onClick={togglePlay} className="play-btn">
          {isPlaying ? "⏸" : "▶"}
        </button>

        <input
          type="range"
          min="0"
          max={duration || 0}
          value={progress || 0}
          step="0.1"
          onChange={(e) => seekTo(Number(e.target.value))}
        />

        <div className="time">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>

      </div>

    </div>
  );
}

export default MiniPlayer;