import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const audio = audioRef.current; // ✅ IMPORTANT FIX

  const frameRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [queue, setQueue] = useState([]);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);

  const [repeatMode, setRepeatMode] = useState("off");
  const repeatModeRef = useRef("off");

  // ================= AUDIO SYNC =================
  useEffect(() => {
    const updateProgress = () => {
      setProgress(audio.currentTime || 0);
      frameRef.current = requestAnimationFrame(updateProgress);
    };

    const start = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(updateProgress);
      setIsPlaying(true);
    };

    const pause = () => {
      cancelAnimationFrame(frameRef.current);
      setIsPlaying(false);
    };

    const loaded = () => {
      setDuration(audio.duration || 0);
    };

    const ended = () => {
      if (repeatModeRef.current === "one") {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      nextSong();
    };

    audio.addEventListener("play", start);
    audio.addEventListener("pause", pause);
    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("play", start);
      audio.removeEventListener("pause", pause);
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("ended", ended);

      cancelAnimationFrame(frameRef.current);
    };
  }, [queue]);

  // ================= PLAY SONG =================
  const playSong = async (song, songList = []) => {
    if (songList.length) {
      setQueue(songList);
    }

    const isSameSong = currentSong?.id === song.id;

    if (!isSameSong) {
      const audioUrl = song.audio_file?.startsWith("http")
        ? song.audio_file
        : `https://musify-backend-67qs.onrender.com${song.audio_file}`;
      console.log("AUDIO URL:", audioUrl);

      audio.src = audioUrl;
      audio.load();

      setCurrentSong(song);
      setProgress(0);
      setDuration(0);
    }

    try {
      await audio.play();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= TOGGLE PLAY =================
  const togglePlay = async () => {
    if (!currentSong) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= NEXT =================
  const nextSong = () => {
    if (!currentSong || queue.length === 0) return;

    const index = queue.findIndex((s) => s.id === currentSong.id);

    if (isShuffle) {
      const r = Math.floor(Math.random() * queue.length);
      playSong(queue[r], queue);
      return;
    }

    const nextIndex = index + 1;

    if (nextIndex < queue.length) {
      playSong(queue[nextIndex], queue);
    } else {
      playSong(queue[0], queue);
    }
  };

  // ================= PREV =================
  const previousSong = () => {
    if (!currentSong || queue.length === 0) return;

    const index = queue.findIndex((s) => s.id === currentSong.id);

    if (index > 0) {
      playSong(queue[index - 1], queue);
    }
  };

  // ================= SEEK =================
  const seekTo = (time) => {
    audio.currentTime = time;
    setProgress(time);
  };

  // ================= VOLUME =================
  const changeVolume = (v) => {
    audio.volume = Number(v);
    setVolume(Number(v));
  };

  // ================= STOP =================
  const stopSong = () => {
    audio.pause();
    audio.src = "";

    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  };

  // ================= SHUFFLE =================
  const toggleShuffle = () => {
    setIsShuffle((p) => !p);
  };

  // ================= REPEAT =================
  const toggleRepeat = () => {
    const next =
      repeatModeRef.current === "off"
        ? "one"
        : repeatModeRef.current === "one"
        ? "all"
        : "off";

    repeatModeRef.current = next;
    setRepeatMode(next);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
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

        queue,
        setQueue,
        stopSong,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => useContext(MusicPlayerContext);
