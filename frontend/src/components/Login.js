// Login.jsx
// Simple mock login form using context and fake token auth.

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import config from "../config";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const { login, currentUser, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to homepage if already logged in
  useEffect(() => {
    if (token && currentUser) {
      window.location.href = "/";
    }
  }, [token, currentUser, navigate, location.state]);

  // Helper to create a fake token
  const generateMockToken = (email) => {
    return `mock-token-${email}-${Date.now()}`;
  };

  // Handle form submission and mock login logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Fetch all users (mock user lookup)
      const usersResponse = await axios.get(`${config.backendUrl}/api/v1/users`);
      const user = usersResponse.data.find((u) => u.email === email);

      if (!user) {
        throw new Error("No account found with this email");
      }

      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // 2. Create mock token
      const mockToken = generateMockToken(email);

      // 3. Prevent duplicate logins
      if (currentUser && currentUser.email === email) {
        throw new Error("This user is already logged in");
      }

      // 4. Set login state
      login(mockToken, user);

      // 5. Redirect after login
      navigate(location.state?.from || "/profile", {
        state: { newLogin: true }
      });

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src="/bblogo.png" alt="Bark Bux Logo" className="h-28" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {currentUser ? "Switch Account" : "Log In"}
        </h2>

        {currentUser && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            Currently logged in as: {currentUser.email}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {currentUser ? "Switching..." : "Logging in..."}
              </>
            ) : (
              currentUser ? "Switch Account" : "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
