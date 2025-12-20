/* eslint-disable no-empty */
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";


// Build base URL with optional API prefix
const buildBaseURL = () => {
  const rawBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://learn-and-earn-server-side.vercel.app";

  const base = rawBase.replace(/\/$/, "");
  const rawPrefix = (import.meta.env.VITE_API_PREFIX || "").trim();
  const normalizedPrefix = rawPrefix
    ? rawPrefix.startsWith("/") ? rawPrefix : `/${rawPrefix}`
    : "";

  return `${base}${normalizedPrefix}`.replace(/\/$/, "");
};

// Axios instance
const axiosSecure = axios.create({
  baseURL: buildBaseURL(),
  withCredentials: false,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /* REQUEST */
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

    /*  RESPONSE */
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          //  FORCE LOGOUT
          localStorage.removeItem("access-token");

          // Prevent infinite redirect loop
          if (!window.location.pathname.includes("/auth/login")) {
            navigate("/auth/login", { replace: true });
          }
        }

        return Promise.reject(error);
      }
    );

    /*  CLEANUP  */
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
