# app/jobs/redemption_job.rb
class RedemptionJob < ApplicationJob
  queue_as :default

  def perform(user_id, reward_id, idempotency_key)
    user = User.find(user_id)
    reward = Reward.find(reward_id)
    RedemptionService.new(user, reward, idempotency_key).redeem
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error("RedemptionJob failed: #{e.message}")
    # Notify admins (e.g., via Sentry)
  end
end