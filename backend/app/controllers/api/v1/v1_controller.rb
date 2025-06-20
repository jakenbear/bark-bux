# app/controllers/api/v1/v1_controller.rb
module Api
  module V1
    class V1Controller < ApplicationController
      before_action :authenticate_user!

      private

      def authenticate_user!
        auth_header = request.headers["Authorization"]
        
        if auth_header && auth_header.match(/^Bearer\s+(.+)$/)
          token = $1.strip
          begin
            decoded = JWT.decode(token, ENV.fetch("SECRET_KEY_BASE"), true, { algorithm: "HS256" })
            payload = decoded[0]
            @current_user = User.find_by(id: payload["user_id"])

            unless @current_user
              log_authentication_failure("User not found", payload["user_id"])
              render json: { error: "Unauthorized: User not found" }, status: :unauthorized
              return
            end

            log_authentication_success(@current_user.id)
          rescue JWT::ExpiredSignature
            log_authentication_failure("Expired token")
            render json: { error: "Unauthorized: Token expired" }, status: :unauthorized
            return
          rescue JWT::VerificationError, JWT::DecodeError => e
            log_authentication_failure("Invalid token")
            render json: { error: "Unauthorized: Invalid token" }, status: :unauthorized
            return
          end
        else
          log_authentication_failure("Missing or malformed Authorization header")
          render json: { error: "Unauthorized: Missing or invalid token" }, status: :unauthorized
        end
      end

      def current_user
        @current_user
      end

      # Secure logging methods
      def log_authentication_success(user_id)
        Rails.logger.info "[AUTH] Successful authentication for user #{user_id}"
      end

      def log_authentication_failure(reason, user_id = nil)
        message = "[AUTH] Failed authentication"
        message += " for user #{user_id}" if user_id
        message += " - #{reason}"
        Rails.logger.warn message
      end
    end
  end
end