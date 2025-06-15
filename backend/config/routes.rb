# config/routes.rb
# Defines API routes for versioned endpoints and a basic health check.

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # User endpoints (list and detail)
      resources :users, only: [:index, :show]

      # Reward endpoints (list and detail)
      resources :rewards, only: [:index, :show]

      # Redemption endpoint (create only)
      resources :redemptions, only: [:create]

      # Custom route to fetch a user's redemption history
      get "users/:id/redemptions", to: "users#redemptions"
    end
  end

  # Simple health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # Uncomment and set your root route here if needed
  # root "posts#index"
end
