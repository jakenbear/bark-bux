import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import axios from "axios";

function Profile() {
  const { currentUser, updateUser } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [redemptionsLoading, setRedemptionsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

    const fetchData = async () => {
      setUserLoading(true);
      setRedemptionsLoading(true);
      setError(null);

      try {
        // Fetch latest user data to ensure up-to-date points
        await updateUser(currentUser.id);

        // Fetch redemptions
        const response = await axios.get(`${backendUrl}/api/v1/users/${currentUser.id}/redemptions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setRedemptions(response.data);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load data");
      } finally {
        setUserLoading(false);
        setRedemptionsLoading(false);
      }
    };

    fetchData();
    // Depend only on currentUser.id to avoid re-running when currentUser updates
  }, [currentUser?.id, updateUser]);

  if (!currentUser) {
    return <p className="p-4">Please log in to view your profile</p>;
  }

  if (userLoading || redemptionsLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-3xl font-bold mb-4">Welcome, {currentUser.name}!</h2>
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

      <h3 className="text-xl font-semibold mt-6 mb-4">Redemption History</h3>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error: {error}
        </div>
      ) : redemptions.length === 0 ? (
        <div className="bg-gray-50 text-gray-500 p-6 rounded-lg text-center">
          No redemptions yet. Start redeeming your points for awesome rewards!
        </div>
      ) : (
        <div className="grid gap-4">
          {redemptions.map((redemption) => (
            <div
              key={redemption.id}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">{redemption.reward.name}</h4>
                  <p className="text-gray-600">{redemption.reward.description}</p>
                </div>
                <div className="text-red-600 font-bold text-lg">
                  -{redemption.reward.points} pts
                </div>
              </div>
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