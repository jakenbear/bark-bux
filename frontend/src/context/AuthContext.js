// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
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
        setLoading(false);
        return;
      }
      try {
        const user = await fetchUser();
        setCurrentUser(user);
      } catch (error) {
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
    const response = await api.post("/api/v1/login", { email, password });
    setCurrentUser(response.data.user);
    setToken(response.data.token);
    localStorage.setItem("authToken", response.data.token);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.delete("/api/v1/logout");
    } catch (error) {
      // optionally handle error silently
    } finally {
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
