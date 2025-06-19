// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { fetchUser } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        console.log("No token in state, skipping fetchUser");
        setLoading(false);
        return;
      }
      try {
        console.log("Fetching user from /api/v1/users/me");
        const user = await fetchUser();
        console.log("Fetch user response:", user);
        setCurrentUser(user);
      } catch (error) {
        console.error("Fetch user error:", error.response?.data || error.message);
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [token]);

  const login = async ({ email, password }) => {
    try {
      console.log("Logging in with:", { email });
      const response = await api.post("/api/v1/login", { email, password });
      console.log("Login response:", response.data);
      setCurrentUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("authToken", response.data.token);
      console.log("Stored token in localStorage:", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out");
      await api.delete("/api/v1/logout");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
      console.log("Cleared token from localStorage");
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);