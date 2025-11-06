import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL?.replace(/\/+$/, "") ||
  "https://habitvault-backend-nvkk.onrender.com/api";

if (typeof window !== "undefined") {
  // helpful in prod to verify where requests go
  console.log("[HabitVault] API baseURL:", baseURL);
}

const API = axios.create({
  baseURL,           // e.g. https://.../api
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token; // backend expects raw token
  return config;
});

API.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.code === "ECONNABORTED") err.message = "Network is slow. Please try again.";
    else if (err.message === "Network Error") err.message = "Cannot reach server. Check your internet.";
    return Promise.reject(err);
  }
);

export default API;
