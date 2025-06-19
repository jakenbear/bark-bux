# app/controllers/api/v1/rewards_controller.rb
module Api
  module V1
    class RewardsController < V1Controller
      def index
        rewards = Rails.cache.fetch("rewards_available", expires_in: 1.hour) do
          Reward.available.to_a
        end
        
        if rewards.any?
          render json: rewards, each_serializer: RewardSerializer, status: :ok
        else
          render json: { rewards: [] }, status: :ok
        end
      end

      def show
        reward = Reward.find(params[:id])
        render json: reward, serializer: RewardSerializer
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Reward not found" }, status: :not_found
      end
    end
  end
end