# spec/controllers/api/v1/redemptions_controller_spec.rb
require "rails_helper"

RSpec.describe Api::V1::RedemptionsController, type: :controller do
  let(:user) { create(:user, points: 200) }
  let(:reward) { create(:reward, points: 100, stock: 5) }
  let(:token) { JWT.encode({ user_id: user.id, exp: 24.hours.from_now.to_i }, Rails.application.secrets.secret_key_base) }

  before do
    cookies.signed[:auth_token] = token
  end

  describe "POST #create" do
    it "queues a redemption job" do
      expect(RedemptionJob).to receive(:perform_later).with(user.id, reward.id, anything)
      post :create, params: { redemption: { reward_id: reward.id } }, format: :json
      expect(response).to have_http_status(:accepted)
      expect(JSON.parse(response.body)["message"]).to eq("Redemption queued")
    end
  end
end