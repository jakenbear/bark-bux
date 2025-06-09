import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";

function RewardsList() {
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);

      axios
        .get(`${config.backendUrl}/api/v1/users/${storedUser.id}`)
        .then((res) => setUser(res.data));
    }

    axios.get(`${config.backendUrl}/api/v1/rewards`).then((response) => {
      setRewards(response.data);
    });
  }, []);

  const redeemReward = (rewardId) => {
    axios
      .post(`${config.backendUrl}/api/v1/redemptions`, {
        user_id: user.id,
        reward_id: rewardId,
      })
      .then(() => {
        toast.success("🎉 Reward redeemed!");
        launchConfetti();

        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === rewardId
              ? { ...reward, stock: reward.stock - 1 }
              : reward
          )
        );

        axios
          .get(`${config.backendUrl}/api/v1/users/${user.id}`)
          .then((res) => setUser(res.data));
      })
      .catch((error) =>
        toast.error(error.response?.data?.errors?.join(", ") || error.message)
      );
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (!user) return <p className="p-4">Loading user...</p>;

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-4">Available Rewards</h2>
      <p className="mb-4">
        You have <strong>{user.points}</strong> Bark-Bux points.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <div key={reward.id} className="border p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">{reward.name}</h3>
            <p>{reward.description}</p>
            <p>Points: {reward.points}</p>
            <p>Stock: {reward.stock}</p>
            <button
              onClick={() => redeemReward(reward.id)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={reward.stock === 0 || user.points < reward.points}
            >
              {reward.stock === 0
                ? "Out of stock"
                : user.points < reward.points
                ? "Not enough points"
                : "Redeem"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RewardsList;
