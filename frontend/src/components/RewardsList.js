import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUser, fetchRewards, redeemReward } from "../api/api";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";

function RewardsList() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [redeeming, setRedeeming] = useState(null);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!currentUser,
  });

  const {
    data: rewardsData = [],
    isLoading: rewardsLoading,
    error: rewardsError,
  } = useQuery({
    queryKey: ["rewards"],
    queryFn: fetchRewards,
    keepPreviousData: true,
  });

  // Preserve the original order based on ID or other consistent value
  const sortedRewards = useMemo(() => {
    return [...rewardsData].sort((a, b) => a.id - b.id);
  }, [rewardsData]);

  const redemptionMutation = useMutation({
    mutationFn: redeemReward,
    onMutate: async (rewardId) => {
      await queryClient.cancelQueries(["rewards"]);
      const previousRewards = queryClient.getQueryData(["rewards"]);

      if (previousRewards) {
        queryClient.setQueryData(["rewards"], (old) =>
          old.map((reward) =>
            reward.id === rewardId
              ? { ...reward, stock: Math.max(0, reward.stock - 1) }
              : reward,
          ),
        );
      }

      return { previousRewards };
    },
    onSuccess: (data) => {
      if (data.status === "queued") {
        toast.success("Redemption is being processed");
      } else if (data.redemption) {
        toast.success("🎉 Reward redeemed!");
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    },
    onError: (error, _, context) => {
      if (context?.previousRewards) {
        queryClient.setQueryData(["rewards"], context.previousRewards);
      }
      toast.error(error.response?.data?.error || "Failed to redeem reward");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["rewards"]);
      queryClient.invalidateQueries(["user"]);

      // 💡 Add delay to keep disabled button visible briefly
      setTimeout(() => {
        setRedeeming(null);
      }, 800);
    },
  });

  const handleRedeem = (rewardId) => {
    if (redeeming) return; // Prevent multiple quick clicks
    setRedeeming(rewardId);
    redemptionMutation.mutate(rewardId);
  };

  if (userLoading || rewardsLoading)
    return <div className="p-4">Loading...</div>;

  if (userError || rewardsError) {
    return (
      <div className="p-4 bg-red-50 text-red-600">
        {userError?.message || rewardsError?.message || "Error loading data"}
      </div>
    );
  }

  if (!currentUser) return <div className="p-4">Please log in</div>;

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-4">Available Rewards</h2>
      <p className="mb-4">
        You have <strong>{user.points}</strong> Bark-Bux points.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedRewards.map((reward) => {
          const isDisabled =
            reward.stock === 0 ||
            user.points < reward.points ||
            redeeming === reward.id;

          return (
            <div
              key={reward.id}
              className="border p-4 rounded-lg shadow-lg transition-all"
              style={{ minHeight: "200px" }}
            >
              <h3 className="text-xl font-semibold">{reward.name}</h3>
              <p className="text-gray-600 mb-2">{reward.description}</p>
              <div className="flex justify-between mb-3">
                <span>Points: {reward.points}</span>
                <span
                  className={
                    reward.stock < 3 ? "text-red-500" : "text-green-500"
                  }
                >
                  Stock: {reward.stock}
                </span>
              </div>

              <button
                onClick={() => handleRedeem(reward.id)}
                className={`mt-2 w-full py-2 rounded-md font-medium transition ${
                  isDisabled
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isDisabled}
              >
                {redeeming === reward.id ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : reward.stock === 0 ? (
                  "Out of stock"
                ) : user.points < reward.points ? (
                  "Not enough points"
                ) : (
                  "Redeem Now"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RewardsList;
