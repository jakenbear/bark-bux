require 'test_helper'

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_users_url
    assert_response :success
  end

  test "should get show" do
    user = User.create!(name: "Test User") # Ensure User model exists
    get api_v1_user_url(user)
    assert_response :success
  end
end
