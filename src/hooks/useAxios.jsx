import axios from "axios";

// Build base URL with optional API prefix (e.g., /api or /api/v1)
const buildBaseURL = () => {
  const base = (import.meta.env.VITE_API_BASE_URL || "https://learn-and-earn-server-side.vercel.app").replace(/\/$/, "");
  const prefix = (import.meta.env.VITE_API_PREFIX || "").trim();
  if (!prefix) return base;
  const normalizedPrefix = prefix.startsWith("/") ? prefix : `/${prefix}`;
  return `${base}${normalizedPrefix}`.replace(/\/$/, "");
};

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: buildBaseURL(),
    withCredentials: false,
  });

  return axiosInstance;
};

export default useAxios;

