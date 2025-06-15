import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import axios from "axios";

function Profile() {
  // Get current user info and updateUser function from Auth context
  const { currentUser, updateUser } = useAuth();

  // State to hold redemption history records
  const [redemptions, setRedemptions] = useState([]);

  // Loading states for user info and redemption data
  const [userLoading, setUserLoading] = useState(true);
  const [redemptionsLoading, setRedemptionsLoading] = useState(true);

  // State for any errors encountered while fetching data
  const [error, setError] = useState(null);

  // useEffect to fetch latest user data and redemptions when currentUser changes
  useEffect(() => {
    if (!currentUser) return; // If no logged-in user, skip fetching

    // Backend API URL, falling back to localhost for development
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

    // Async function to fetch updated user data and redemption history
    const fetchData = async () => {
      setUserLoading(true);
      setRedemptionsLoading(true);
      setError(null);

      try {
        // Update user info to get latest points from backend
        await updateUser(currentUser.id);

        // Fetch the user's redemption history from backend API
        const response = await axios.get(
          `${backendUrl}/api/v1/users/${currentUser.id}/redemptions`,
          {
            headers: {
              // Send auth token stored in localStorage
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Save the retrieved redemption data in state
        setRedemptions(response.data);
      } catch (err) {
        // Log and save error message to display to user
        console.error("Failed to load data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load data");
      } finally {
        // Mark loading as complete regardless of success or failure
        setUserLoading(false);
        setRedemptionsLoading(false);
      }
    };

    // Run the async fetch function
    fetchData();

    // Depend only on currentUser.id and updateUser to avoid infinite loops
  }, [currentUser?.id, updateUser]);

  // If no user is logged in, prompt to login
  if (!currentUser) {
    return <p className="p-4">Please log in to view your profile</p>;
  }

  // Show loading spinner while fetching user info or redemptions
  if (userLoading || redemptionsLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Greeting with user's name */}
      <h2 className="text-3xl font-bold mb-4">Welcome, {currentUser.name}!</h2>

      {/* User info section: email and current points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600"><strong>Email:</strong></p>
          <p className="text-lg">{currentUser.email}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600"><strong>Available Points:</strong></p>
          <p className="text-2xl font-bold text-green-600">{currentUser.points} pts</p>
        </div>
      </div>

      {/* Redemption history header */}
      <h3 className="text-xl font-semibold mt-6 mb-4">Redemption History</h3>

      {/* Show error message if API call failed */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error: {error}
        </div>
      ) : 
      /* If no redemptions yet, show friendly message */
      redemptions.length === 0 ? (
        <div className="bg-gray-50 text-gray-500 p-6 rounded-lg text-center">
          No redemptions yet. Start redeeming your points for awesome rewards!
        </div>
      ) : (
        /* Map over redemption records and display them */
        <div className="grid gap-4">
          {redemptions.map((redemption) => (
            <div
              key={redemption.id}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                {/* Reward name and description */}
                <div>
                  <h4 className="text-lg font-semibold">{redemption.reward.name}</h4>
                  <p className="text-gray-600">{redemption.reward.description}</p>
                </div>

                {/* Points spent on the reward */}
                <div className="text-red-600 font-bold text-lg">
                  -{redemption.reward.points} pts
                </div>
              </div>

              {/* Date redeemed, formatted nicely */}
              <p className="text-sm text-gray-500 mt-2">
                Redeemed {format(new Date(redemption.created_at), "MMMM d, yyyy")} (
                {formatDistanceToNow(new Date(redemption.created_at), { addSuffix: true })})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
