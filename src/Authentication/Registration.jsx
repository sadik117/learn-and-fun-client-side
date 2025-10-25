/* eslint-disable no-unused-vars */
import React, { useContext, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import registerAnimation from "../assets/registration.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";

// (reverted) no public axios usage

export default function Registration() {
  const { createUser, setUser, updateUserProfile } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const referredBy = useMemo(() => {
    const q = new URLSearchParams(location.search);
    const ref = q.get("ref");
    return ref ? ref.toUpperCase() : null;
  }, [location.search]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm();

  const validatePassword = (password) => {
    const isLongEnough = password.length >= 6;
    return isLongEnough;
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    const formDataImg = new FormData();
    formDataImg.append("image", image);
    setUploading(true);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        { method: "POST", body: formDataImg }
      );
      const data = await res.json();
      if (data.success) {
        setPhotoURL(data.data.url);
        toast.success("Photo uploaded!");
      } else toast.error("Upload failed");
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  // Send OTP (reverted to secure instance)
  const onSendOtp = async () => {
    const email = getValues("email");
    if (!email) return toast.error("Please enter your email first");
    try {
      const res = await axiosSecure.post("/send-otp", { email });
      if (res.data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email!");
      } else toast.error("Failed to send OTP");
    } catch (error) {
      toast.error("Error sending OTP: " + error.message);
    }
  };

  // Verify OTP (reverted to secure instance)
  const onVerifyOtp = async () => {
    const email = getValues("email");
    if (!otp) return toast.error("Please enter the OTP");
    try {
      const res = await axiosSecure.post("/verify-otp", { email, otp });
      if (res.data.success) {
        setOtpVerified(true);
        toast.success("OTP verified! You can now register.");
      } else toast.error(res.data.message || "Invalid OTP");
    } catch (error) {
      toast.error("Error verifying OTP: " + error.message);
    }
  };

  const onSubmit = async (data) => {
    if (!otpVerified) return toast.error("Verify OTP before registering.");
    if (!validatePassword(data.password)) {
      setError("password", {
        type: "manual",
        message:
          "Password must contain uppercase, lowercase & be at least 6 characters.",
      });
      return;
    }
    if (!photoURL) return toast.error("Please upload a profile picture.");

    try {
      const emailNormalized = data.email.trim().toLowerCase();
      // Step 1: Store in backend
      const userInfo = {
        email: emailNormalized,
        name: data.name,
        photoURL,
        phone: data.phone,
        role: "user",
        referredBy,
      };

      const response = await axiosSecure.post("/users", userInfo);
      // Backend may return token for existing users; fetch if missing
      let token = response?.data?.token;
      if (!token) {
        const jwtRes = await axiosSecure.post("/jwt", {
          email: emailNormalized,
        });
        token = jwtRes?.data?.token;
      }
      if (!token) return toast.error("Failed to get auth token.");

      // Step 2: Firebase account
      const result = await createUser(emailNormalized, data.password);

      // Step 3: Firebase profile update
      await updateUserProfile({ displayName: data.name, photoURL });

      // Save JWT
      localStorage.setItem("access-token", token);

      // Put into context
      setUser({ ...result.user, displayName: data.name, photoURL });

      toast.success("Registration successful!");
      navigate(location.state?.from || "/");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed: " + error.message);

      // Rollback: remove DB user if Firebase failed
      try {
        const emailForRollback = (getValues("email") || "")
          .trim()
          .toLowerCase();
        await axiosSecure.delete(
          `/users/${encodeURIComponent(emailForRollback)}`
        );
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
  };

  return (
    <div className="min-h-screen mx-2 md:mx-10 my-5 md:my-10 py-20 bg-gradient-to-br from-[#0a0ac7] to-[#aa24b8] flex items-center justify-center px-4">

      <Helmet>
        <title>Registration || Learn and Earned</title>
      </Helmet>

      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl border border-white/20 flex flex-col md:flex-row gap-6 items-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <div className="w-full md:w-1/2">
          <Lottie animationData={registerAnimation} loop />
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-white text-3xl font-bold text-center mb-6">
            Register
          </h2>

          {/* Small chip to show referral source if present */}
          {referredBy && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-white text-sm">
              Referred by
              <span className="font-semibold tracking-wider">{referredBy}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Name */}
            <div>
              <label className="block text-white mb-1">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full px-4 py-2 rounded-md bg-white/10 border ${
                  errors.name ? "border-red-500" : "border-white/20"
                } text-white`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white mb-1">Phone Number</label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                className={`w-full px-4 py-2 rounded-md bg-white/10 border ${
                  errors.phone ? "border-red-500" : "border-white/20"
                } text-white`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-white mb-1">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white file:text-white file:bg-teal-600 file:border-none file:px-4 file:py-1.5 file:rounded hover:file:bg-teal-700"
              />
              {uploading && (
                <p className="text-yellow-300 text-sm mt-1">Uploading...</p>
              )}
              {photoURL && (
                <img
                  src={photoURL}
                  alt="Preview"
                  className="mt-2 w-14 h-14 rounded-full ring ring-primary object-cover"
                />
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-white mb-1">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-2 rounded-md bg-white/10 border ${
                  errors.email ? "border-red-500" : "border-white/20"
                } text-white`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* OTP */}
            {!otpSent ? (
              <button
                type="button"
                onClick={onSendOtp}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md mb-4"
              >
                Send OTP
              </button>
            ) : (
              <div>
                <label className="block text-white mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                  disabled={otpVerified}
                />
                {!otpVerified ? (
                  <button
                    type="button"
                    onClick={onVerifyOtp}
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md"
                  >
                    Verify OTP
                  </button>
                ) : (
                  <p className="text-green-400 mt-2 font-semibold">
                    OTP Verified ✔️
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-white mb-1">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className={`w-full px-4 py-2 rounded-md bg-white/10 border ${
                  errors.password ? "border-red-500" : "border-white/20"
                } text-white`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 transition px-4 py-2 rounded-md text-white font-semibold"
              disabled={uploading || !otpVerified}
              title={!otpVerified ? "Verify OTP to enable registration" : ""}
            >
              Register
            </motion.button>
          </form>

          <p className="text-center text-sm text-white mt-4">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-green-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
