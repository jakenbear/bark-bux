require 'test_helper'

class Api::V1::RewardsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_rewards_url
    assert_response :success
  end

  test "should get show" do
    reward = Reward.create!(name: "Test Reward") # Ensure Reward model exists
    get api_v1_reward_url(reward)
    assert_response :success
  end
end
