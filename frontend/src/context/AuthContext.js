// src/context/AuthContext.js
// Provides authentication state and helpers (login, logout, update user) across the app.
// Manages token and currentUser state synced with localStorage.
// Handles initial auth loading and updates user info securely with backend.

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Auth token string (e.g., JWT) used for authenticated requests
  const [token, setToken] = useState(null);
  // Current authenticated user object with details (id, name, email, points, etc.)
  const [currentUser, setCurrentUser] = useState(null);
  // Loading flag while initializing auth state from localStorage
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

  // Initialize auth state on mount from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("currentUser");

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setCurrentUser(userData);
        } catch (error) {
          console.error("Failed to parse stored user data", error);
          logout(); // Clear invalid auth data
        }
      }
      setLoading(false); // Done initializing
    };

    initializeAuth();
  }, []);

  // Login function: sets token and user data in state and localStorage
  // Returns true if successful, false on error
  const login = async (mockToken, userData) => {
    try {
      if (!mockToken || !userData?.id) {
        throw new Error("Invalid authentication data");
      }

      localStorage.setItem("token", mockToken);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      setToken(mockToken);
      setCurrentUser(userData);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      logout(); // Ensure clean state on failure
      return false;
    }
  };

  // Logout function: clears auth state and localStorage
  // Returns true if successful, false on error
  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setToken(null);
      setCurrentUser(null);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  // Updates currentUser state by fetching fresh user data from backend
  // Uses token for Authorization header
  // Updates localStorage only if user data changed (shallow compare)
  // Logs out user if unauthorized (401)
  const updateUser = useCallback(async (userId) => {
    try {
      if (!token) throw new Error("Not authenticated");

      const response = await axios.get(`${backendUrl}/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;

      setCurrentUser((prev) => {
        if (
          prev &&
          prev.id === userData.id &&
          prev.name === userData.name &&
          prev.email === userData.email &&
          prev.points === userData.points
        ) {
          return prev; // No changes, keep current state
        }
        localStorage.setItem("currentUser", JSON.stringify(userData));
        return userData;
      });

      return userData;
    } catch (error) {
      console.error("Failed to update user", error);
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
