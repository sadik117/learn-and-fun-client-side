import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const LotteryGame = () => {
  const axiosSecure = useAxiosSecure();
  const [balance, setBalance] = useState(0);
  const [freePlays, setFreePlays] = useState(0);
  const [playsCount, setPlaysCount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user data initially
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosSecure.get("/users/me"); 
        setBalance(res.data.balance || 0);
        setFreePlays(res.data.freePlaysLeft || 0);
        setPlaysCount(res.data.playsCount || 0);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, [axiosSecure]);

  // Play game handler
  const handlePlay = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axiosSecure.post("/lottery/play");
      if (res.data.success) {
        setBalance(res.data.balance);
        setFreePlays(res.data.freePlaysLeft);
        setPlaysCount(res.data.playsCount);
        setMessage(res.data.message);
      } else {
        setMessage(res.data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || "Failed to play"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full p-6 shadow-xl rounded-2xl bg-white text-center space-y-6">
        <h1 className="text-2xl font-bold text-blue-600">🎰 Lottery</h1>

        {/* Balance and stats */}
        <div className="grid grid-cols-3 gap-4 text-sm font-medium">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-gray-500">Balance</p>
            <p className="text-blue-600 font-bold">{balance}৳</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-gray-500">Free Plays</p>
            <p className="text-green-600 font-bold">{freePlays}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-gray-500">Plays Count</p>
            <p className="text-purple-600 font-bold">{playsCount}</p>
          </div>
        </div>

        {/* Play Button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50"
            onClick={handlePlay}
            disabled={loading}
          >
            {loading ? "Playing..." : "Play (50৳)"}
          </button>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg font-medium ${
              message.includes("Congrats")
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LotteryGame;
