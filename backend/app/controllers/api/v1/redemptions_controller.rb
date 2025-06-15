# app/controllers/api/v1/redemptions_controller.rb
# Handles reward redemption requests from users.

module Api
  module V1
    class RedemptionsController < ApplicationController
      # Creates a new redemption record if valid
      def create
        redemption = Redemption.new(redemption_params)
        if redemption.save
          render json: redemption, status: :created
        else
          render json: { errors: redemption.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      # Strong params for creating a redemption
      def redemption_params
        params.require(:redemption).permit(:user_id, :reward_id)
      end
    end
  end
end

