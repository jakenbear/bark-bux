// src/api/axios.js
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add request interceptor to set Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
      console.log("Token retrieved from localStorage:", token);
    } else {
      console.log("No token found in localStorage");
    }
    console.log(`Request: ${config.method.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      headers: {
        "access-control-allow-origin": response.headers["access-control-allow-origin"] || "none",
        "access-control-expose-headers": response.headers["access-control-expose-headers"] || "none",
        "x-debug-cookie": response.headers["x-debug-cookie"] || "none",
      },
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error(`Error: ${error.config?.method.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers || "none",
    });
    return Promise.reject(error);
  }
);

export default api;