import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://shopcrm-server-5e5331b6be39.herokuapp.com",
  // withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
