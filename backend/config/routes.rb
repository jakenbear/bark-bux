# config/routes.rb
Rails.application.routes.draw do
  # Devise needs to be mounted outside the API namespace
  devise_for :users

  namespace :api do
  namespace :v1 do
    resources :rewards, only: [:index, :show]
    resources :users, only: [:show]  # Remove the redemptions member route
    resources :redemptions, only: [:index, :create]  # Add index action
    post "/login", to: "sessions#create"
    delete "/logout", to: "sessions#destroy"
  end
end
end

