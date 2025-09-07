/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PlayAndWin = () => {
  const axiosSecure = useAxiosSecure();
  const [balance, setBalance] = useState(0);
  const [freePlays, setFreePlays] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [slots, setSlots] = useState(["❓", "❓", "❓"]);
  const [isWin, setIsWin] = useState(false);
  const [isLoss, setIsLoss] = useState(false);

  const slotItems = ["🍒", "🍋", "🍇", "🍊", "7️⃣", "⭐", "💎"];

  // Fetch user profile (correct endpoint)
  const fetchUser = async () => {
    try {
      const res = await axiosSecure.get("/my-profile");
      setBalance(res.data?.balance ?? 0);
      setFreePlays(res.data?.freePlaysLeft ?? 0);
    } catch (error) {
      console.error("Failed to fetch profile:", error?.response?.data || error);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Random roll during spin
  const randomSlots = () => [
    slotItems[Math.floor(Math.random() * slotItems.length)],
    slotItems[Math.floor(Math.random() * slotItems.length)],
    slotItems[Math.floor(Math.random() * slotItems.length)],
  ];

  const handlePlay = async () => {
    setLoading(true);
    setMessage("");
    setIsWin(false);
    setIsLoss(false);
    setSpinning(true);

    // Spin animation
    const spinInterval = setInterval(() => {
      setSlots(randomSlots());
    }, 120);

    try {
      const res = await axiosSecure.post("/lottery/play");

      setTimeout(() => {
        clearInterval(spinInterval);
        setSpinning(false);
        setLoading(false);

        if (res.data?.success) {
          // ✅ Always show 💎💎💎 if win; else show backend slots (or random fallback)
          const finalSlots = res.data.win
            ? ["💎", "💎", "💎"]
            : res.data.slots || randomSlots();
          setSlots(finalSlots);

          setBalance(res.data.balance ?? 0);
          setFreePlays(res.data.freePlaysLeft ?? 0);
          setMessage(res.data.message || "");

          if (res.data.win) {
            setIsWin(true);
            setIsLoss(false);
          } else {
            setIsLoss(true);
            setIsWin(false);
          }

          // Hard refresh (optional) to ensure sync
          fetchUser();
        } else {
          setMessage(res.data?.message || "Something went wrong");
          setIsLoss(true);
        }
      }, 3000);
    } catch (error) {
      clearInterval(spinInterval);
      setSpinning(false);
      setLoading(false);
      setMessage(
        "Error: " + (error?.response?.data?.message || "Failed to play")
      );
      setIsLoss(true);
    }
  };

  // Glow around card based on result
  const resultGlow =
    !spinning && (isWin || isLoss)
      ? isWin
        ? "ring-4 ring-green-400 shadow-[0_0_40px_rgba(34,197,94,0.45)]"
        : "ring-4 ring-red-300 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
      : "";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-md w-full p-8 rounded-3xl bg-white text-center space-y-6 shadow-2xl transition-all duration-300 ${resultGlow}`}
      >
        <h1 className="text-3xl font-extrabold text-purple-700">🎰 Lottery</h1>

        {/* Balance & Free Plays */}
        <div className="grid grid-cols-2 gap-4 text-sm font-medium">
          <div className="bg-blue-50 p-3 rounded-xl shadow-inner">
            <p className="text-gray-500">Balance</p>
            <p className="text-blue-600 font-bold text-lg">{balance}৳</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl shadow-inner">
            <p className="text-gray-500">Free Plays</p>
            <p className="text-green-600 font-bold text-lg">{freePlays}</p>
          </div>
        </div>

        {/* Slots */}
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
                ${!spinning && isLoss ? "ring-2 ring-red-200" : ""}
              `}
            >
              {item}
            </motion.div>
          ))}
        </div>

        {/* CTA: Free first, then paid */}
        <motion.div whileTap={{ scale: 0.97 }}>
          <button
            className={`w-full py-3 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors
              ${
                freePlays > 0
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              }
            `}
            onClick={handlePlay}
            disabled={loading || spinning}
            title={freePlays > 0 ? "Use a free play" : "Cost: 50৳"}
          >
            {loading
              ? "Playing..."
              : freePlays > 0
              ? "Play Free (0৳)"
              : "Play (50৳)"}
          </button>
        </motion.div>

        {/* Result message */}
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
    </div>
  );
};

export default PlayAndWin;
