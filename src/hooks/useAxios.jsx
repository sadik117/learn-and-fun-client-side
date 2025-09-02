import axios from "axios";

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL:
      import.meta.env.VITE_API_BASE_URL ||
      "https://learn-and-earn-server-side.vercel.app",
    withCredentials: false,
  });

  return axiosInstance;
};

export default useAxios;

