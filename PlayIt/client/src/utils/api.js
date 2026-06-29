// src/utils/api.js
import axios from "axios";

// Create Axios instance for backend API
const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Add auth token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
