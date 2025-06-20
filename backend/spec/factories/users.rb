# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    name { "Test User" }
    email { "test#{rand(1000)}@example.com" }
    password { "password123" }
    points { 100 }
  end
end