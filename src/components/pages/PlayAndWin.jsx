/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState} from "react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DinoGame from "../DinoGame"; 

export default function PlayAndWin({ user }) {
  const axiosSecure = useAxiosSecure();

  // Lottery free play
  const [freePlaysLeft, setFreePlaysLeft] = useState(3);
  const [lotteryResult, setLotteryResult] = useState(null);

  // Dino game
  const [dailyDinoPlaysLeft, setDailyDinoPlaysLeft] = useState(3);

  // Play lottery free
  const playFree = async () => {
    if (freePlaysLeft <= 0) return alert("Daily free play limit reached!");

    try {
      const res = await axiosSecure.post("/lottery/play-free", {
        email: user.email,
      });
      if (res.data.success) {
        setFreePlaysLeft(freePlaysLeft - 1);
        setLotteryResult(res.data);
        alert(res.data.message);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error playing free lottery");
    }
  };

  // Submit Dino score
  const submitDinoScore = async (score) => {
    if (dailyDinoPlaysLeft <= 0) return alert("Daily Dino game limit reached!");

    try {
      const res = await axiosSecure.post("/dinogame/play", {
        email: user.email,
        score,
      });
      if (res.data.success) {
        setDailyDinoPlaysLeft(3 - res.data.dailyPlaysUsed);
        alert(res.data.message + ` Your new balance: ${res.data.newBalance} Taka`);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit Dino score");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-10">

      {/* Lottery Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center p-6"
      >
        <h2 className="text-2xl font-bold mb-4">🎰 Lottery Free Play</h2>
        <p className="mb-4">Free plays left today: {freePlaysLeft}</p>
        <button
          onClick={playFree}
          disabled={freePlaysLeft <= 0}
          className={`py-3 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition 
            ${freePlaysLeft > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Play Free
        </button>
        {lotteryResult && (
          <div className="mt-4">
            <p>Slots: {lotteryResult.slots.join(" ")}</p>
            <p>{lotteryResult.message}</p>
          </div>
        )}
      </motion.div>

      {/* Dino Game Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">🦖 Dino Game</h2>
        <p className="text-center mb-4">Daily plays left: {dailyDinoPlaysLeft}</p>
        {dailyDinoPlaysLeft > 0 ? (
          <DinoGame submitScore={submitDinoScore} />
        ) : (
          <p className="text-red-500 text-center font-bold">
            You have reached the daily Dino game limit.
          </p>
        )}
      </motion.div>

    </div>
  );
}
