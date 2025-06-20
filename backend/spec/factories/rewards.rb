# spec/factories/rewards.rb
FactoryBot.define do
  factory :reward do
    name { "Test Reward" }
    description { "A great reward" }
    points { 100 }
    stock { 10 }
  end
end