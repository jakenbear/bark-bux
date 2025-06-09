require 'test_helper'

class Api::V1::RedemptionsControllerTest < ActionDispatch::IntegrationTest
  test "should create redemption" do
    user = User.create!(name: "Test User")
    reward = Reward.create!(name: "Test Reward")
    post api_v1_redemptions_url, params: { redemption: { user_id: user.id, reward_id: reward.id } }, as: :json
    assert_response :success
  end
end
