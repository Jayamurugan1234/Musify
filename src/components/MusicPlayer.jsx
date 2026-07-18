import { useMusicPlayer } from "../Context/MusicPlayerContext";
import "./MusicPlayer.css";

function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    previousSong,
    progress,
    duration,
    seekTo,
    volume,
    changeVolume,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = useMusicPlayer();

  if (!currentSong) return null;

  const formatTime = (t) => {
    if (!t && t !== 0) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="player">
      {/* LEFT */}
      <div className="player-left">
        <img
          src={currentSong.cover_image}
          alt=""
          className="player-cover"
        />
        <div className="player-info">
          <h4>{currentSong.title}</h4>
          <p>Artist #{currentSong.artist}</p>
        </div>
      </div>

      {/* CENTER */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className={isShuffle ? "active-btn" : ""}
            onClick={toggleShuffle}
          >
            🔀
          </button>

          <button onClick={previousSong}>⏮</button>

          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button onClick={nextSong}>⏭</button>

          <button
            className={repeatMode !== "off" ? "active-btn" : ""}
            onClick={toggleRepeat}
          >
            {repeatMode === "one" ? "🔂" : "🔁"}
          </button>
        </div>

        <div className="progress-container">
          <span className="time">{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress || 0}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="progress-bar"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="player-right">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
}

export default MusicPlayer;

