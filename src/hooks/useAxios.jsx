import axios from "axios";

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "https://learn-and-earn-server-side.vercel.app",
    withCredentials: false,
  });

  return axiosInstance;
};

export default useAxios;

