// src/pages/PlayAndWin.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";


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

  const slotItems = ["🍒", "🍋", "🍇", "🍊", "7️⃣", "⭐", "💎"];

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const res = await axiosSecure.get("/my-profile");
      setFreePlays(res.data?.freePlaysLeft ?? 0);
      setTokens(res.data?.tokens ?? 0);
      setEmail(res.data?.email || "");
    } catch (error) {
      console.error("Failed to fetch profile:", error?.response?.data || error);
    }
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
        const finalSlots = apiResponse.win ? ["💎", "💎", "💎"] : apiResponse.slots || randomSlots();
        setSlots(finalSlots);

        if (apiResponse.freePlaysLeft !== undefined && apiResponse.freePlaysLeft !== null) {
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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-6 space-y-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-md w-full p-8 rounded-3xl bg-white text-center space-y-6 shadow-2xl transition-all duration-300 ${resultGlow}`}
      >
        <h1 className="text-3xl font-extrabold text-purple-700">🎰 Free Lottery</h1>

        <div className="bg-yellow-50 p-4 rounded-xl shadow-inner text-center">
          <p className="text-gray-600">Available Tokens</p>
          <p className="text-yellow-600 font-bold text-2xl">{tokens}</p>
        </div>

        <div className="flex justify-center space-x-4 text-5xl font-bold my-6">
          {slots.map((item, i) => (
            <motion.div
              key={i}
              animate={spinning ? { y: [0, -20, 0] } : isWin ? { scale: [1, 1.06, 1] } : {}}
              transition={{ repeat: spinning ? Infinity : 0, duration: spinning ? 0.3 : 0.5 }}
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
              ${freePlays > 0 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
            onClick={handlePlay}
            disabled={freePlays === 0 || loading || spinning}
          >
            {freePlays > 0 ? (loading ? "Playing..." : "Play Free") : "Locked (No Free Plays)"}
          </button>
        </motion.div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl font-semibold shadow-md ${isWin ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {message}
          </motion.div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center">
        <img src="https://via.placeholder.com/800x320?text=Dino+Game" alt="Play Dino Game" className="w-full h-56 object-cover" />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">🦖 Play Dino Game</h2>
          <p className="text-gray-500 text-sm mb-4">Jump over obstacles and beat your high score — no money required!</p>
          <Link to="/dinogame" className="block w-full py-3 text-lg font-semibold rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg transition">Play Now</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayAndWin;
