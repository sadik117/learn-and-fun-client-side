/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const PlayAndWin = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [tokens, setTokens] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockDate, setUnlockDate] = useState(null);

  const [remainingToday, setRemainingToday] = useState(3);
  const [nextResetAt, setNextResetAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const [slots, setSlots] = useState(["❓", "❓", "❓"]);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");
  const [isWin, setIsWin] = useState(false);

  const slotItems = ["🍒", "🍋", "🍇", "🍊", "7️⃣", "⭐", "💎"];

  /* =========================
     FETCH USER PROFILE
  ========================= */
  const fetchUser = async () => {
    const res = await axiosSecure.get("/my-profile");

    setTokens(res.data.tokens || 0);

    const unlocked =
      res.data.unlockDate &&
      new Date(res.data.unlockDate) > new Date();

    setIsUnlocked(unlocked);
    setUnlockDate(res.data.unlockDate || null);

    if (res.data.remainingToday !== undefined) {
      setRemainingToday(res.data.remainingToday);
    }

    if (res.data.nextResetAt) {
      setNextResetAt(new Date(res.data.nextResetAt));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* =========================
     RESET COUNTDOWN (UI ONLY)
  ========================= */
  useEffect(() => {
    if (!nextResetAt) return;

    const interval = setInterval(() => {
      const diff = new Date(nextResetAt) - new Date();
      if (diff <= 0) {
        setTimeLeft("");
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [nextResetAt]);

  /* =========================
     SLOT SPIN ANIMATION
  ========================= */
  const randomSlots = () =>
    slotItems.map(
      () => slotItems[Math.floor(Math.random() * slotItems.length)]
    );

  /* =========================
     PLAY LOTTERY
  ========================= */
  const handlePlay = async () => {
    if (!isUnlocked || remainingToday <= 0 || loading) return;

    setLoading(true);
    setSpinning(true);
    setMessage("");
    setIsWin(false);

    const spin = setInterval(() => {
      setSlots(randomSlots());
    }, 120);

    try {
      const res = await axiosSecure.post("/lottery/play-free");

      setTimeout(() => {
        clearInterval(spin);
        setSpinning(false);
        setLoading(false);

        setSlots(res.data.slots);
        setRemainingToday(res.data.remainingToday);
        setNextResetAt(new Date(res.data.nextResetAt));
        setMessage(res.data.message);
        setIsWin(res.data.win);
      }, 2000);
    } catch (err) {
      clearInterval(spin);
      setSpinning(false);
      setLoading(false);
      setMessage(err.response?.data?.message || "Play failed");
    }
  };

  /* =========================
     UNLOCK GAMES
  ========================= */
  const handleUnlock = async () => {
    if (tokens < 4) {
      setMessage("You need at least 4 tokens to unlock games.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosSecure.post("/games/unlock");
      setMessage(res.data.message);
      fetchUser();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unlock failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-6 space-y-12">
      {/* Header */}
      <div className="w-full max-w-2xl p-6 bg-white/10 rounded-3xl border border-white/20 shadow-2xl flex flex-col md:flex-row justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-yellow-400 font-semibold">Available Tokens</p>
          <p className="text-4xl font-bold text-white">{tokens}</p>
        </div>

        {!isUnlocked ? (
          <button
            onClick={handleUnlock}
            disabled={tokens < 4 || loading}
            className={`px-6 py-3 rounded-xl font-bold ${
              tokens >= 4
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-400 text-gray-200"
            }`}
          >
            Unlock (4 Tokens)
          </button>
        ) : (
          <div className="text-green-400 font-semibold">
            🎮 Games Unlocked
          </div>
        )}
      </div>

      {/* Lottery Card */}
      <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          🎰 Free Lottery
        </h1>

        <div className="flex justify-center gap-4 text-5xl mb-6">
          {slots.map((item, i) => (
            <motion.div
              key={i}
              animate={spinning ? { y: [-10, 10] } : {}}
              transition={{ repeat: spinning ? Infinity : 0, duration: 0.3 }}
              className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-xl shadow"
            >
              {item}
            </motion.div>
          ))}
        </div>

        <button
          onClick={handlePlay}
          disabled={!isUnlocked || remainingToday <= 0 || loading}
          className={`w-full py-3 rounded-xl font-semibold ${
            isUnlocked && remainingToday > 0
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 text-gray-200"
          }`}
        >
          {remainingToday > 0
            ? `Play Free (${remainingToday} left)`
            : `Reset in ${timeLeft || "00:00:00"}`}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl font-semibold ${
              isWin
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Dino Game */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center">
        <img
          src="https://i.ibb.co.com/8DjJygQK/google-dinosaur-game.jpg"
          alt="Dino Game"
          className="w-full h-56 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">🦖 Dino Game</h2>
          <button
            onClick={() => isUnlocked && navigate("/dinogame")}
            disabled={!isUnlocked}
            className={`w-full py-3 rounded-xl font-semibold ${
              isUnlocked
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-gray-400 text-gray-200"
            }`}
          >
            {isUnlocked ? "Play Free" : "Locked"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayAndWin;
