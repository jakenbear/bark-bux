# spec/models/redemption_spec.rb
require "rails_helper"

RSpec.describe Redemption, type: :model do
  let(:user) { create(:user, points: 200) }
  let(:reward) { create(:reward, points: 100, stock: 5) }

  it "deducts points and decreases stock on creation" do
    redemption = Redemption.create!(user: user, reward: reward)
    expect(user.reload.points).to eq(100)
    expect(reward.reload.stock).to eq(4)
  end

  it "fails if user has insufficient points" do
    user.update!(points: 50)
    redemption = Redemption.new(user: user, reward: reward)
    expect(redemption).not_to be_valid
    expect(redemption.errors[:user]).to include("does not have enough points")
  end

  it "fails if reward is out of stock" do
    reward.update!(stock: 0)
    redemption = Redemption.new(user: user, reward: reward)
    expect(redemption).not_to be_valid
    expect(redemption.errors[:reward]).to include("is out of stock")
  end
end