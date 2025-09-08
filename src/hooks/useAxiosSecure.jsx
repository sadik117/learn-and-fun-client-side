import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Build base URL with optional API prefix (e.g., /api or /api/v1)
const buildBaseURL = () => {
  const base = (import.meta.env.VITE_API_BASE_URL || "https://learn-and-earn-server-side.vercel.app").replace(/\/$/, "");
  const prefix = (import.meta.env.VITE_API_PREFIX || "").trim();
  if (!prefix) return base;
  const normalizedPrefix = prefix.startsWith("/") ? prefix : `/${prefix}`;
  return `${base}${normalizedPrefix}`.replace(/\/$/, "");
};

// Create a secure Axios instance
const axiosSecure = axios.create({
  baseURL: buildBaseURL(),
  // Use Authorization header, not cookies
  withCredentials: false,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // - Optional: handle 401 globally
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate("/auth/login");
        }
        return Promise.reject(error);
      }
    );

    // - Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
