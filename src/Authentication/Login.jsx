import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { AuthContext } from "./AuthProvider";

export default function Login() {
  const { setUser, signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const axios = useAxios();

  const from = location.state?.from?.pathname || "/";

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Normalize email for consistency with backend
      const emailNormalized = email.trim().toLowerCase();
      // Firebase / custom signIn function
      const result = await signIn(emailNormalized, password);
      setUser(result.user);

      // Request JWT from backend
      const { data } = await axios.post("/jwt", { email: emailNormalized });
      if (data.token) {
        localStorage.setItem("access-token", data.token);
      }

      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Login failed! " + error.message);
    }
  };

  return (
    <div className="min-h-screen py-20 mx-2 md:mx-10 my-5 md:my-10 bg-gradient-to-br from-[#0a0ac7] to-[#aa24b8] flex items-center justify-center px-4">
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl border border-white/20 flex flex-col md:flex-row gap-6 items-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <div className="w-full md:w-1/2 md:block">
          <Lottie animationData={loginAnimation} loop={true} />
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-white text-3xl font-bold text-center mb-6">
            Welcome Back
          </h2>

          {/* Email/password form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-white mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-white mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 transition px-4 py-2 rounded-md text-white font-semibold"
            >
              Log In
            </motion.button>
          </form>

          <p className="text-center text-sm text-white mt-4">
            Don’t have an account?{" "}
            <Link to="/auth/signup" className="text-green-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
