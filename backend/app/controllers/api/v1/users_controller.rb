# app/controllers/api/v1/users_controller.rb
# Provides user data and redemption history through API endpoints.

module Api
  module V1
    class UsersController < ApplicationController
      # Returns a list of all users
      def index
        render json: User.all
      end

      # Returns details for a specific user
      def show
        user = User.find(params[:id])
        render json: user
      end

      # Returns a user's redemptions with associated reward details
      def redemptions
        user = User.find(params[:id])
        redemptions = user.redemptions.includes(:reward).order(created_at: :desc)

        render json: redemptions.as_json(
          include: {
            reward: {
              only: [:name, :description, :points]
            }
          },
          only: [:id, :created_at]
        )
      end
    end
  end
end


