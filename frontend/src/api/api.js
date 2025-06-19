// src/api/api.js
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "./axios";

// API functions
export const fetchUser = async () => {
  const response = await api.get("/api/v1/users/me");
  return response.data.user;
};

export const fetchRewards = async () => {
  const response = await api.get("/api/v1/rewards");
  return response.data;
};

export const fetchRedemptions = async () => {
  const response = await api.get('/api/v1/redemptions');
  return response.data || [];
};

export const redeemReward = async (rewardId) => {
  const idempotencyKey = crypto.randomUUID();
  const response = await api.post(
    '/api/v1/redemptions', 
    { reward_id: rewardId },
    { headers: { "Idempotency-Key": idempotencyKey } }
  );
  return response.data;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

// Wrap app with QueryClientProvider in App.js
export function QueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}