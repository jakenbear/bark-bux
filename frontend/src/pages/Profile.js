import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser, fetchRedemptions } from '../api/api';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { currentUser } = useAuth();
  
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: !!currentUser,
  });

  const { 
    data: redemptionData = [], 
    isLoading: redemptionsLoading, 
    error: redemptionsError 
  } = useQuery({
    queryKey: ['redemptions'],
    queryFn: fetchRedemptions,
    enabled: !!currentUser,
  });

  // Extract redemptions from response data
  const redemptions = Array.isArray(redemptionData) ? redemptionData : [];

  if (!currentUser) return <p className="p-4">Please log in to view your profile</p>;
  if (userLoading || redemptionsLoading) {
    return <div className="p-4">Loading...</div>;
  }
  if (userError || redemptionsError) {
    return <div className="p-4 bg-red-50 text-red-600">
      {userError?.message || redemptionsError?.message || "Error loading data"}
    </div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600"><strong>Email:</strong></p>
          <p className="text-lg">{user.email}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600"><strong>Available Points:</strong></p>
          <p className="text-2xl font-bold text-green-600">{user.points} pts</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">Redemption History</h3>
      
      {redemptions.length === 0 ? (
        <div className="bg-gray-50 text-gray-500 p-6 rounded-lg text-center">
          No redemptions yet. Start redeeming your points for awesome rewards!
        </div>
      ) : (
        <div className="grid gap-4">
          {redemptions.map((redemption) => (
            <div key={redemption.id} className="border rounded-xl p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">{redemption.reward?.name || 'Unknown Reward'}</h4>
                  <p className="text-gray-600">{redemption.reward?.description || ''}</p>
                </div>
                <div className="text-red-600 font-bold text-lg">
                  -{redemption.reward?.points || 0} pts
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Redeemed {new Date(redemption.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;