import axios from "axios";

const BASE_URL = import.meta.env.PROD
  ? "https://ailyes.com/api/v1"
  : "http://localhost:8080/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
