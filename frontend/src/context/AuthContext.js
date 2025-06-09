import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

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
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

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
      logout();
      return false;
    }
  };

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

  const updateUser = useCallback(async (userId) => {
    try {
      if (!token) throw new Error("Not authenticated");

      const response = await axios.get(`${backendUrl}/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;

      // Only update state if data has changed
      setCurrentUser((prev) => {
        if (
          prev &&
          prev.id === userData.id &&
          prev.name === userData.name &&
          prev.email === userData.email &&
          prev.points === userData.points
        ) {
          return prev; // No update needed
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
  }, [token]); // Depend on token to re-create updateUser if token changes

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}