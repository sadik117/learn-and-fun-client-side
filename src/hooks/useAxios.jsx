import axios from "axios";

// Build base URL with optional API prefix (e.g., /api or /api/v1)
const buildBaseURL = () => {
  const rawBase = import.meta.env.VITE_API_BASE_URL ||
    "https://learn-and-earn-server-side.vercel.app";
  const base = rawBase.replace(/\/$/, "");
  const rawPrefix = (import.meta.env.VITE_API_PREFIX || "").trim();
  const normalizedPrefix = rawPrefix
    ? (rawPrefix.startsWith("/") ? rawPrefix : `/${rawPrefix}`)
    : "";

  const finalURL = `${base}${normalizedPrefix}`.replace(/\/$/, "");

  // Log once in the browser to help diagnose prod env config
  try {
    if (typeof window !== "undefined" && !window.__LEARN_API_BASE_LOGGED__) {
      // eslint-disable-next-line no-console
      console.log(
        "[API] base:", base,
        "prefix:", normalizedPrefix || "(none)",
        "=>",
        finalURL
      );
      if (!normalizedPrefix) {
        // eslint-disable-next-line no-console
        console.warn(
          "[API] No VITE_API_PREFIX set. Ensure backend accepts bare paths or set /api."
        );
      }
      window.__LEARN_API_BASE_LOGGED__ = true;
    }
  } catch {}

  return finalURL;
};

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: buildBaseURL(),
    withCredentials: false,
  });

  return axiosInstance;
};

export default useAxios;
