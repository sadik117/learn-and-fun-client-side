/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/PlayAndWin.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const PlayAndWin = () => {
  const axiosSecure = useAxiosSecure();
  const [freePlays, setFreePlays] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [slots, setSlots] = useState(["❓", "❓", "❓"]);
  const [isWin, setIsWin] = useState(false);
  const [isLoss, setIsLoss] = useState(false);
  const [unlockDate, setUnlockDate] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const navigate = useNavigate();

  const slotItems = ["🍒", "🍋", "🍇", "🍊", "7️⃣", "⭐", "💎"];

  // Fetch user profile
  const fetchUser = async () => {
    const res = await axiosSecure.get("/my-profile");

    setFreePlays(res.data?.freePlaysLeft ?? 0);
    setTokens(res.data?.tokens ?? 0);
    setEmail(res.data?.email || "");

    const unlock = res.data?.unlockDate
      ? new Date(res.data.unlockDate) > new Date()
      : false;

    setUnlockDate(res.data?.unlockDate || null);
    setIsUnlocked(unlock);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const randomSlots = () => [
    slotItems[Math.floor(Math.random() * slotItems.length)],
    slotItems[Math.floor(Math.random() * slotItems.length)],
    slotItems[Math.floor(Math.random() * slotItems.length)],
  ];

  const handlePlay = async () => {
    if (spinning || loading || freePlays <= 0) return;

    setLoading(true);
    setMessage("");
    setIsWin(false);
    setIsLoss(false);
    setSpinning(true);

    const spinInterval = setInterval(() => {
      setSlots(randomSlots());
    }, 120);

    let apiResponse = null;

    try {
      const res = await axiosSecure.post("/lottery/play-free", { email });
      apiResponse = res.data;
    } catch (error) {
      apiResponse = {
        success: false,
        message: error?.response?.data?.message || "Failed to play",
      };
    }

    setTimeout(() => {
      clearInterval(spinInterval);
      setSpinning(false);
      setLoading(false);

      if (apiResponse && apiResponse.success) {
        const finalSlots = apiResponse.win
          ? ["💎", "💎", "💎"]
          : apiResponse.slots || randomSlots();
        setSlots(finalSlots);

        if (
          apiResponse.freePlaysLeft !== undefined &&
          apiResponse.freePlaysLeft !== null
        ) {
          setFreePlays(apiResponse.freePlaysLeft);
        } else {
          // fall back to refetch
          fetchUser();
        }

        setMessage(apiResponse.message || "");
        setIsWin(Boolean(apiResponse.win));
        setIsLoss(!apiResponse.win);
      } else {
        setMessage(apiResponse?.message || "Something went wrong");
        setIsLoss(true);
      }

      fetchUser();
    }, 2000);
  };

  const resultGlow =
    !spinning && (isWin || isLoss)
      ? isWin
        ? "ring-4 ring-green-400 shadow-[0_0_40px_rgba(34,197,94,0.45)]"
        : "ring-4 ring-red-300 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
      : "";

  const handleUnlock = async () => {
    if (tokens < 4) {
      setMessage("You need at least 4 tokens to unlock games.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosSecure.post("/games/unlock", { email });

      setMessage(res.data.message);
      fetchUser();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unlock failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-6 space-y-12">

      {/* Header Section with Tokens and Unlock */}
      <div className="w-full max-w-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
          {/* Token Display - Prominent and Centered */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-2xl shadow-lg">
              <p className="text-sm font-semibold text-yellow-900 uppercase tracking-wider">
                Available Tokens
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className="text-4xl font-bold text-yellow-900">
                  {tokens}
                </span>
                <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center">
                  <span className="text-lg font-bold text-yellow-800">T</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unlock Button - Side by side on desktop, stacked on mobile */}
          {!isUnlocked && (
            <div className="flex-1 text-center md:text-right">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-5 rounded-2xl shadow-xl">
                <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                  <span className="text-white font-semibold">
                    🔒 Games Locked
                  </span>
                </div>
                <button
                  onClick={handleUnlock}
                  disabled={tokens < 4 || loading}
                  className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02]
                ${
                  tokens >= 4
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Unlocking...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Unlock Games</span>
                      <span className="bg-white/20 px-2 py-1 rounded-lg">
                        4 Tokens
                      </span>
                    </span>
                  )}
                </button>
                <p className="text-white/80 text-sm mt-2">
                  Unlock all games for <strong>14 days</strong>
                </p>
              </div>
            </div>
          )}

          {/* Status Indicator when unlocked */}
          {isUnlocked && (
            <div className="flex-1 text-center md:text-right">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <span className="text-2xl">🎮</span>
                  <div>
                    <p className="text-white font-bold text-lg">
                      Games Unlocked!
                    </p>
                    {/* <p className="text-white/90 text-sm">
                      Free plays available: {freePlays}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-md w-full p-8 rounded-3xl bg-white text-center space-y-6 shadow-2xl transition-all duration-300 ${resultGlow}`}
      >
        <h1 className="text-3xl font-extrabold text-purple-700">
          🎰 Free Lottery
        </h1>

        <div className="flex justify-center space-x-4 text-5xl font-bold my-6">
          {slots.map((item, i) => (
            <motion.div
              key={i}
              animate={
                spinning
                  ? { y: [0, -20, 0] }
                  : isWin
                  ? { scale: [1, 1.06, 1] }
                  : {}
              }
              transition={{
                repeat: spinning ? Infinity : 0,
                duration: spinning ? 0.3 : 0.5,
              }}
              className={`w-20 h-20 flex items-center justify-center rounded-xl bg-gray-100 shadow-lg 
                ${!spinning && isWin ? "ring-4 ring-green-400" : ""} 
                ${!spinning && isLoss ? "ring-2 ring-red-200" : ""}`}
            >
              {item}
            </motion.div>
          ))}
        </div>

        <motion.div whileTap={{ scale: freePlays > 0 ? 0.97 : 1 }}>
          <button
            className={`w-full py-3 text-lg font-semibold rounded-xl shadow-lg transition-colors
              ${
                freePlays > 0
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            onClick={handlePlay}
            disabled={!isUnlocked}
          >
            {isUnlocked
              ? loading
                ? "Playing..."
                : "Play Free"
              : "Locked (No Free Plays)"}
          </button>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl font-semibold shadow-md ${
              isWin
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {message}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center"
      >
        <img
          src="https://i.ibb.co.com/8DjJygQK/google-dinosaur-game.jpg"
          alt="Play Dino Game"
          className="w-full h-56 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            🦖 Play Dino Game
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Jump over obstacles and beat your high score — no money required!
          </p>
          <button
            onClick={() => !isUnlocked && navigate("/dinogame")}
            disabled={freePlays === 0}
            className={`w-full py-3 text-lg font-semibold rounded-xl shadow-lg transition
    ${
      freePlays > 0
        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
        : "bg-gray-400 text-gray-200 cursor-not-allowed"
    }`}
          >
            {isUnlocked ? "Play Free" : "Locked (No Free Plays)"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayAndWin;
