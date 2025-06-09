module Api
  module V1
    class UsersController < ApplicationController
      def index
        render json: User.all
      end

      def show
        user = User.find(params[:id])
        render json: user
      end

      def redemptions
        user = User.find(params[:id])
        redemptions = user.redemptions.includes(:reward).order(created_at: :desc)

        render json: redemptions.as_json(include: {
          reward: {
            only: [:name, :description, :points]
          }
        }, only: [:id, :created_at])
      end
    end
  end
end

