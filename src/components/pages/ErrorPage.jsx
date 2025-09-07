/* eslint-disable no-unused-vars */
import React from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import animationData from "../../assets/error-animation.json";
import { Link } from "react-router";


const ErrorPage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-md w-full">

        <Lottie animationData={animationData} loop={true} />
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 mt-2 mb-4">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default ErrorPage;
