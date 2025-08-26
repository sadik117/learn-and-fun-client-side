import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";

// ---------- Helpers ----------
const getThumb = (ytId) => `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

// Lazy loader for the YouTube IFrame API (singleton)
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

  // Load courses
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosSecure.get("/courses"); // -> [{ key, name }]
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

  // Load videos for active course
  useEffect(() => {
    if (!activeKey) return;
    let mounted = true;
    (async () => {
      try {
        const res = await axiosSecure.get(`/videos?courseKey=${activeKey}`);
        if (!mounted) return;
        // expected: [{ _id, yt, title }]
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

  // ESC closes modal
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setSelectedVideo(null);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">Learn & Grow 📚</h1>
        <p className="text-gray-300 mt-2">Choose a course and start watching.</p>
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
                  <p className="font-semibold leading-snug">{v.title || "Video"}</p>
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
   Video Modal (YouTube API)
=========================== */
function VideoModal({ video, courseName, onClose }) {
  if (!video) return null;

  const title = video?.title || "Video";
  const ytId = video?.yt || "";
  const canPlay = Boolean(ytId);

  const wrapperRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [theater, setTheater] = useState(false);
  const [quality, setQuality] = useState("auto"); // auto | hd720 | hd1080
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);

  // Track YouTube player state: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
  const [ytState, setYtState] = useState(-1);

  // Handle document fullscreen changes
  useEffect(() => {
    const onFsChange = async () => {
      const fs = Boolean(document.fullscreenElement);
      setIsFullscreen(fs);

      // Try lock/unlock orientation (Android Chrome & others, not iOS)
      try {
        if (fs && screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape");
        } else if (!fs && screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch {
        // Ignore if not supported or blocked
      }
    };

    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Load YT API & init player
  useEffect(() => {
    if (!canPlay) return;

    let destroyed = false;

    (async () => {
      const YT = await loadYouTubeAPI();
      if (destroyed) return;

      // destroy any previous player
      if (playerRef.current?.destroy) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }

      playerRef.current = new YT.Player(playerContainerRef.current, {
        videoId: ytId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          controls: 1,          // we cover on pause/end
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,                // no YT fullscreen
          playsinline: 1,
          iv_load_policy: 3,    // hide annotations
          loop: 1,              // loop to avoid end screen
          playlist: ytId,
        },
        events: {
          onReady: (e) => {
            try {
              if (quality === "hd1080") e.target.setPlaybackQuality("hd1080");
              else if (quality === "hd720") e.target.setPlaybackQuality("hd720");
              else e.target.setPlaybackQuality("default");
              e.target.playVideo();
            } catch (_) {}
          },
          onStateChange: (e) => {
            setYtState(e.data);
            if (e.data === 0) {
              // Ended → reset to 0 and pause, show overlay
              try {
                e.target.seekTo(0, true);
                e.target.pauseVideo();
              } catch (_) {}
            }
          },
        },
      });
    })();

    return () => {
      destroyed = true;
      if (playerRef.current?.destroy) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
    };
  }, [ytId, canPlay, quality]);

  // Update quality after player exists
  useEffect(() => {
    const p = playerRef.current;
    if (!p?.setPlaybackQuality) return;
    try {
      if (quality === "hd1080") p.setPlaybackQuality("hd1080");
      else if (quality === "hd720") p.setPlaybackQuality("hd720");
      else p.setPlaybackQuality("default");
    } catch (_) {}
  }, [quality]);

  // Block right click
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    const node = wrapperRef.current;
    node?.addEventListener("contextmenu", prevent);
    return () => node?.removeEventListener("contextmenu", prevent);
  }, []);

  // Toggle fullscreen on our wrapper
  const toggleFullscreen = async () => {
    const node = wrapperRef.current;
    if (!node) return;
    try {
      if (!document.fullscreenElement) {
        await node.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Our overlay is visible when NOT playing:
  const showOverlay = ytState !== 1; // paused, ended, unstarted, buffering, etc.

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
        className={`relative mx-auto
          ${isFullscreen
            ? "w-screen h-[100svh] max-w-none rounded-none border-0 mt-0"
            : `${theater ? "max-w-7xl md:w-[95%]" : "max-w-5xl md:w-[85%]"} w-[92%] mt-10 rounded-2xl border border-gray-700`}
          bg-gray-900 overflow-hidden shadow-2xl`}
      >
        {/* Header */}
        {!isFullscreen && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="font-semibold text-white truncate pr-4">{title}</h3>

            <div className="flex items-center gap-2">
              {/* Quality selector */}
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-2 py-1 text-sm"
                title="Playback Quality"
              >
                <option value="auto">Auto</option>
                <option value="hd720">720p</option>
                <option value="hd1080">1080p</option>
              </select>

              {/* Size controls */}
              <button
                onClick={() => setTheater((v) => !v)}
                className="text-xs px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200"
                title="Toggle Theater Size"
              >
                {theater ? "Default" : "Theater"}
              </button>
              <button
                onClick={toggleFullscreen}
                className="text-xs px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200"
                title="Fullscreen"
              >
                Full
              </button>

              <button
                onClick={onClose}
                className="text-gray-300 hover:text-white text-2xl leading-none px-2"
                aria-label="Close"
                title="Close (Esc)"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Player */}
        <div
          className={`relative select-none bg-black
            ${isFullscreen ? "w-screen h-[100svh]" : "aspect-video w-full"}
          `}
        >
          {/* Mount point for YT player */}
          <div
            ref={playerContainerRef}
            className={`${isFullscreen ? "absolute inset-0 w-full h-full" : "absolute inset-0 w-full h-full"}`}
          />

          {/* Overlay for pause / end */}
          {showOverlay && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 z-20">
              <div className="text-white text-lg font-semibold">
                {ytState === 0 ? "Video ended" : "Paused"}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    try {
                      if (ytState === 0) {
                        playerRef.current.seekTo(0, true);
                      }
                      playerRef.current.playVideo();
                    } catch (_) {}
                  }}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
                >
                  {ytState === 0 ? "Replay" : "Resume"}
                </button>
                <button
                  onClick={isFullscreen ? toggleFullscreen : onClose}
                  className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow"
                >
                  {isFullscreen ? "Exit Full" : "Close"}
                </button>
              </div>
            </div>
          )}

          {/* Tiny click-guards over YouTube logo/title zones */}
          <div className="absolute bottom-0 right-0 w-28 h-12 z-10" />
          <div className="absolute top-0 right-0 w-32 h-12 z-10" />
        </div>

        {!isFullscreen && (
          <div className="px-4 py-3 text-sm text-gray-300 border-t border-gray-800">
            <span className="text-gray-400 mr-2">Course:</span>
            {courseName || "—"}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
