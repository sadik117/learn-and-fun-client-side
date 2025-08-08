import axios from "axios";

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: false,
  });

  return axiosInstance;
};

export default useAxios;

