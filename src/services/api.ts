import axios from "axios";

// Access VITE_API_URL, fallback to relative API in the same origin if not defined
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add token to headers if it exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nbi_admin_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
