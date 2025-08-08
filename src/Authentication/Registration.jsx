import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import registerAnimation from "../assets/registration.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function Registration() {
  const { createUser, setUser, updateUserProfile } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [tempUser, setTempUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;
    return hasUpper && hasLower && isLongEnough;
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    const formDataImg = new FormData();
    formDataImg.append("image", image);
    setUploading(true);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formDataImg,
        }
      );
      const data = await res.json();
      if (data.success) {
        setPhotoURL(data.data.url);
        toast.success("Photo uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!validatePassword(data.password)) {
      setError("password", {
        type: "manual",
        message:
          "Password must contain uppercase, lowercase & be at least 6 characters.",
      });
      return;
    }

    if (!photoURL) {
      toast.error("Please upload a profile picture before registering.");
      return;
    }

    try {
      // Step 1: Create Firebase user
      const result = await createUser(data.email, data.password);

      // Step 2: Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      // Step 3: Store temporarily until OTP is verified
      setTempUser({
        ...result.user,
        name: data.name,
        email: data.email,
        phone: data.phone,
        photoURL,
      });

      // Step 4: Request OTP from backend
      await axiosSecure.post("/send-otp", { email: data.email });

      toast.info("OTP sent to your email. Please verify.");
      setShowOtpInput(true);
    } catch (error) {
      console.error(error);
      toast.error("Registration failed: " + error.message);
    }
  };

  const handleOtpVerification = async () => {
    if (!otpCode) {
      toast.error("Enter OTP code");
      return;
    }
    try {
      // Verify OTP with backend
      const verifyRes = await axiosSecure.post("/verify-otp", {
        email: tempUser.email,
        otp: otpCode,
      });

      if (verifyRes.data.success) {
        // Save user in DB after OTP success
        const userInfo = {
          email: tempUser.email,
          name: tempUser.name,
          phone: tempUser.phone,
          photoURL: tempUser.photoURL,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const response = await axiosSecure.post("/users", userInfo);
        const token = response.data.token;
        if (token) {
          localStorage.setItem("access-token", token);
        }

        setUser(tempUser);
        toast.success("Account verified & registered!");
        navigate(location.state?.from || "/");
      } else {
        toast.error("Invalid OTP code");
      }
    } catch (err) {
      toast.error("OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen mx-2 md:mx-10 mt-5 md:mt-10 py-20 bg-gradient-to-br from-[#102a0f] to-[#1a382b] flex items-center justify-center px-4">
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl border border-white/20 flex flex-col md:flex-row gap-6 items-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <div className="w-full md:w-1/2">
          <Lottie animationData={registerAnimation} loop={true} />
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-white text-3xl font-bold text-center mb-6">
            {showOtpInput ? "Verify OTP" : "Register"}
          </h2>

          {!showOtpInput ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white mb-1">Phone Number</label>
                <input
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                  className={`w-full px-4 py-2 rounded-md bg-white/10 border ${
                    errors.phone ? "border-red-500" : "border-white/20"
                  } text-white`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

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
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 transition px-4 py-2 rounded-md text-white font-semibold"
                disabled={uploading}
              >
                Register
              </motion.button>
            </form>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOtpVerification}
                className="w-full bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-md text-white font-semibold"
              >
                Verify OTP
              </motion.button>
            </div>
          )}

          {/* Link to login */}
          {!showOtpInput && (
            <p className="text-center text-sm text-white/70 mt-4">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-green-400 hover:underline">
                Log in
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
