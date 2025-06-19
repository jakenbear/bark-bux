# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < V1Controller
      def show
        if params[:id] == "me"
          if current_user
            render json: { user: current_user.as_json(only: [:id, :email, :name, :points]) }, status: :ok
          else
            render json: { error: "Unauthorized" }, status: :unauthorized
          end
        else
          user = User.find_by(id: params[:id])
          if user
            render json: { user: user.as_json(only: [:id, :email, :name, :points]) }, status: :ok
          else
            render json: { error: "User not found" }, status: :not_found
          end
        end
      end
    end
  end
end