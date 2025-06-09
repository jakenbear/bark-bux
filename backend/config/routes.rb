Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show]
      resources :rewards, only: [:index, :show]
      resources :redemptions, only: [:create]
      get "users/:id/redemptions", to: "users#redemptions"
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
  # root "posts#index"
end