/* eslint-disable no-empty */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const getThumb = (ytId) => `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

let ytApiPromise = null;
function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    document.body.appendChild(tag);
  });

  return ytApiPromise;
}

/* ===========================
   Learn Page
=========================== */
export default function Learn() {
  const axiosSecure = useAxiosSecure();
  const [courses, setCourses] = useState([]);
  const [activeKey, setActiveKey] = useState("");
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosSecure.get("/courses");
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setCourses(list);
        if (list.length) setActiveKey(list[0].key);
      } catch (e) {
        console.error("Failed to load courses", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [axiosSecure]);

  useEffect(() => {
    if (!activeKey) return;
    let mounted = true;
    (async () => {
      try {
        const res = await axiosSecure.get(`/videos?courseKey=${activeKey}`);
        if (!mounted) return;
        setVideos(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Failed to load course videos", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [activeKey, axiosSecure]);

  const activeCourse = useMemo(
    () => courses.find((c) => c.key === activeKey),
    [courses, activeKey]
  );

  const filteredVideos = useMemo(() => {
    if (!query.trim()) return videos;
    const q = query.toLowerCase();
    return videos.filter((v) => (v.title || "").toLowerCase().includes(q));
  }, [videos, query]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setSelectedVideo(null);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 text-white">

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">Learn & Grow 📚</h1>
        <p className="text-gray-300 mt-2">
          Choose a course and start watching.
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {courses.map((c) => {
              const isActive = c.key === activeKey;
              return (
                <button
                  key={c.key}
                  onClick={() => {
                    setActiveKey(c.key);
                    setQuery("");
                  }}
                  className={`px-4 py-2 rounded-full border transition
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent shadow-lg"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeCourse ? `Search in ${activeCourse.name}…` : "Search…"
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-gray-400 py-10">Loading courses…</p>
        ) : !activeCourse ? (
          <p className="text-gray-400 py-10">No courses yet.</p>
        ) : filteredVideos.length === 0 ? (
          <p className="text-gray-400 py-10">No videos in this course.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((v) => (
              <motion.button
                key={v._id || v.yt}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedVideo(v)}
                className="text-left bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/60 shadow hover:shadow-blue-500/10 transition"
              >
                <div className="aspect-video bg-gray-700">
                  <img
                    src={getThumb(v.yt)}
                    alt={v.title || "Video"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold leading-snug">
                    {v.title || "Video"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activeCourse?.name}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Player */}
      <AnimatePresence mode="wait" initial={false}>
        {selectedVideo ? (
          <VideoModal
            key={selectedVideo._id || selectedVideo.yt}
            video={selectedVideo}
            courseName={activeCourse?.name}
            onClose={() => setSelectedVideo(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ===========================
   Video Modal with Controls
=========================== */
function VideoModal({ video, courseName, onClose }) {
  if (!video) return null;

  const ytId = video?.yt || "";
  const wrapperRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    return () => document.removeEventListener("contextmenu", prevent);
  }, []);

  useEffect(() => {
    const onFsChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    if (!ytId) return;
    let destroyed = false;

    (async () => {
      const YT = await loadYouTubeAPI();
      if (destroyed) return;

      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch {}
      }

      playerRef.current = new YT.Player(playerContainerRef.current, {
        videoId: ytId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (ev) => {
            const player = ev.target;
            setDuration(player.getDuration());
            setInterval(() => {
              if (!destroyed) {
                setCurrent(player.getCurrentTime());
              }
            }, 500);
          },
          onStateChange: (ev) => {
            setIsPlaying(ev.data === 1); // 1 = playing
          },
        },
      });
    })();

    return () => {
      destroyed = true;
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch {}
      }
    };
  }, [ytId]);

  const toggleFullscreen = async () => {
    const node = wrapperRef.current;
    if (!node) return;

    try {
      if (!document.fullscreenElement) {
        await node.requestFullscreen();

        // Try locking orientation to landscape
        if (screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock("landscape");
          } catch (e) {
            console.warn("Orientation lock failed:", e);
          }
        }
      } else {
        await document.exitFullscreen();

        // Unlock orientation if supported
        if (screen.orientation && screen.orientation.unlock) {
          try {
            screen.orientation.unlock();
          } catch {}
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleVolume = (val) => {
    setVolume(val);
    if (playerRef.current) {
      playerRef.current.setVolume(val);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setMuted(!muted);
  };

  const handleSeek = (val) => {
    if (playerRef.current) {
      playerRef.current.seekTo(val, true);
      setCurrent(val);
    }
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        ref={wrapperRef}
        role="dialog"
        aria-modal="true"
        className={`relative mx-auto ${
          isFullscreen
            ? "w-screen h-[100svh] max-w-none rounded-none border-0 mt-0"
            : "max-w-5xl w-[92%] mt-10 rounded-2xl border border-gray-700"
        } bg-black overflow-hidden shadow-2xl flex flex-col`}
      >
        {/* Header */}
        {!isFullscreen && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="font-semibold text-white truncate pr-4">
              {video?.title || "Video"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-2xl leading-none px-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Player */}
        <div
          className={`relative bg-black ${
            isFullscreen ? "w-screen h-screen" : "w-full aspect-video"
          }`}
        >
          <div
            ref={playerContainerRef}
            className="absolute inset-0 w-full h-full"
            style={{ width: "100%", height: "120%" }} // <-- enforce full size
          />
        </div>

        {/* Custom Controls */}
        <div className="bg-gray-900/95 px-4 py-2 flex flex-col gap-2 text-white">
          {/* Progress */}
          <input
            type="range"
            min="0"
            max={duration}
            step="1"
            value={current}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full accent-blue-500"
          />

          <div className="flex items-center justify-between text-sm">
            <div className="items-center gap-2 grid-cols-2">
              <button onClick={togglePlay} className="px-1">
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button onClick={toggleMute} className="px-1">
                {muted ? "🔇 Unmute" : "🔊 Mute"}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
              />
              <span className="ml-1">
                {formatTime(current)} / {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
