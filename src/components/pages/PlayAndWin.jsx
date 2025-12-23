/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PlayAndWin = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // core user state
  const [email, setEmail] = useState("");
  const [tokens, setTokens] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // daily limits (SEPARATE)
  const [lotteryRemaining, setLotteryRemaining] = useState(0);
  const [dinoRemaining, setDinoRemaining] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");
  const [isWin, setIsWin] = useState(false);

  // slot visuals
  const [slots, setSlots] = useState(["❓", "❓", "❓"]);
  const slotItems = ["🍒", "🍋", "🍇", "🍊", "7️⃣", "⭐", "💎"];

  // FETCH USER 
  const fetchUser = async () => {
    try {
      const res = await axiosSecure.get("/my-profile");

      setEmail(res.data.email);
      setTokens(res.data.tokens || 0);
      setIsUnlocked(res.data.isUnlocked);

      setLotteryRemaining(res.data.lotteryRemainingPlays || 0);
      setDinoRemaining(res.data.dinoRemainingPlays || 0);
    } catch (err) {
      console.error("PROFILE FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // SLOT ANIMATION 
  const randomSlots = () =>
    Array.from({ length: 3 }, () =>
      slotItems[Math.floor(Math.random() * slotItems.length)]
    );

  //  LOTTERY PLAY 
  const handlePlay = async () => {
    if (!isUnlocked || loading || spinning || lotteryRemaining <= 0) return;

    setLoading(true);
    setSpinning(true);
    setMessage("");
    setIsWin(false);

    const interval = setInterval(() => {
      setSlots(randomSlots());
    }, 120);

    let response;

    try {
      const res = await axiosSecure.post("/lottery/play-free", { email });
      response = res.data;
    } catch (err) {
      response = {
        success: false,
        message: err.response?.data?.message || "Play failed",
      };
    }

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      setLoading(false);

      if (!response.success) {
        setMessage(response.message);
        return;
      }

      setSlots(response.slots);
      setIsWin(response.win);
      setLotteryRemaining(response.remainingPlays);
      setMessage(response.message);
    }, 2000);
  };

  //  UNLOCK 
  const handleUnlock = async () => {
    if (tokens < 4) {
      setMessage("You need 4 tokens to unlock games.");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-6 space-y-10">

      {/* TOKEN + UNLOCK */}
      <div className="bg-white/10 p-6 rounded-2xl w-full max-w-md text-center">
        <p className="text-white font-bold text-xl">Tokens</p>
        <p className="text-yellow-300 text-4xl font-extrabold">{tokens}</p>

        {!isUnlocked ? (
          <button
            onClick={handleUnlock}
            disabled={loading || tokens < 4}
            className="mt-4 w-full py-3 bg-green-600 rounded-xl text-white font-bold disabled:bg-gray-400"
          >
            Unlock Games (4 Tokens)
          </button>
        ) : (
          <p className="mt-4 text-green-400 font-semibold">
            🎮 Games Unlocked
          </p>
        )}
      </div>

      {/* SLOT MACHINE */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-2">
          🎰 Free Lottery
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          Remaining today: {lotteryRemaining}/3
        </p>

        <div className="flex justify-center gap-4 text-5xl mb-6">
          {slots.map((item, i) => (
            <motion.div
              key={i}
              animate={spinning ? { y: [0, -15, 0] } : {}}
              transition={{ repeat: spinning ? Infinity : 0, duration: 0.3 }}
              className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shadow-lg"
            >
              {item}
            </motion.div>
          ))}
        </div>

        <button
          onClick={handlePlay}
          disabled={!isUnlocked || loading || spinning || lotteryRemaining <= 0}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl disabled:bg-gray-400"
        >
          {loading ? "Playing..." : "Play"}
        </button>

        {message && (
          <p
            className={`mt-4 font-semibold ${
              isWin ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* DINO GAME */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        <img
          src="https://i.ibb.co.com/8DjJygQK/google-dinosaur-game.jpg"
          alt="Dino"
          className="h-52 w-full object-cover"
        />
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold">🦖 Dino Game</h2>
          <p className="text-sm text-gray-500 mb-3">
            Remaining today: {dinoRemaining}/3
          </p>

          <button
            onClick={() => navigate("/dinogame")}
            disabled={!isUnlocked || loading || dinoRemaining <= 0}
            className="mt-2 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl disabled:bg-gray-400"
          >
            Play Dino
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayAndWin;
