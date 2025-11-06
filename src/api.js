import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://habitvault-backend-nvkk.onrender.com/api",
  timeout: 15000, // 15s
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;
  return config;
});

// Optional: turn low-level network errors into readable messages
API.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.code === "ECONNABORTED") {
      err.message = "Network is slow. Please try again.";
    } else if (err.message === "Network Error") {
      err.message = "Cannot reach server. Check your internet.";
    }
    return Promise.reject(err);
  }
);

export default API;
