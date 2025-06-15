// Nav.jsx
// Main site navigation bar with conditional rendering and logout handling.

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Nav() {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Hide nav completely on the login page
  if (location.pathname === "/login") return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login", { state: { from: "logout" } });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Navigation Links */}
      <div className="space-x-4">
        <Link 
          to="/" 
          className="hover:underline px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
        >
          Home
        </Link>
        <Link 
          to="/rewards" 
          className="hover:underline px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
        >
          Rewards
        </Link>
        <Link 
          to="/profile" 
          className="hover:underline px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
        >
          Profile
        </Link>
      </div>

      {/* User Info + Logout Button */}
      <div className="flex items-center space-x-4">
        {currentUser && (
          <span className="hidden sm:inline text-sm text-gray-300">
            Welcome, {currentUser.name}
          </span>
        )}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`px-4 py-2 rounded-md text-sm font-medium transition
            ${isLoggingOut 
              ? "bg-gray-600 cursor-not-allowed" 
              : "bg-red-600 hover:bg-red-700"}
          `}
        >
          {isLoggingOut ? (
            <>
              {/* Spinner shown during logout */}
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging Out...
            </>
          ) : (
            "Logout"
          )}
        </button>
      </div>
    </nav>
  );
}

export default Nav;
