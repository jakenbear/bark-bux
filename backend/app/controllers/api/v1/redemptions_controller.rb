module Api
  module V1
    class RedemptionsController < ApplicationController
      def create
        redemption = Redemption.new(redemption_params)
        if redemption.save
          render json: redemption, status: :created
        else
          render json: { errors: redemption.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def redemption_params
        params.require(:redemption).permit(:user_id, :reward_id)
      end
    end
  end
end
