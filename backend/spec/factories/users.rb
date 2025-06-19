# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    name { "Test User" }
    email { "test#{rand(1000)}@example.com" }
    password { "password123" }
    points { 100 }
  end
end

# spec/factories/rewards.rb
FactoryBot.define do
  factory :reward do
    name { "Test Reward" }
    description { "A great reward" }
    points { 100 }
    stock { 10 }
  end
end