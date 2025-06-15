# app/controllers/api/v1/rewards_controller.rb
# Exposes reward data through API endpoints.

module Api
  module V1
    class RewardsController < ApplicationController
      # Returns a list of all rewards
      def index
        render json: Reward.all
      end

      # Returns details for a specific reward
      def show
        reward = Reward.find(params[:id])
        render json: reward
      end
    end
  end
end

