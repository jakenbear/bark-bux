# app/controllers/api/v1/sessions_controller.rb
module Api
  module V1
    class SessionsController < V1Controller
      skip_before_action :authenticate_user!, only: [:create]

      def create
        Rails.logger.debug "Login attempt with params: #{params.inspect}"
        user = User.find_by(email: params[:email]&.downcase)
        if user&.valid_password?(params[:password])
          payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
          token = JWT.encode(payload, ENV.fetch("SECRET_KEY_BASE"), "HS256")
          render json: { user: user.as_json(only: [:id, :email, :name, :points]), token: token }, status: :ok
        else
          Rails.logger.debug "Login failed for email: #{params[:email]}"
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        Rails.logger.debug "Logging out user"
        render json: { message: "Logged out" }, status: :ok
      end
    end
  end
end