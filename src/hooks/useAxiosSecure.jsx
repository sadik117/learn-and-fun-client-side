import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

// Create a secure Axios instance
const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, 
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Request Interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor (handle 401 globally)
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate("/auth/login");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
