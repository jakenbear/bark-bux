# app/services/redemption_service.rb
class RedemptionService
  def initialize(user, reward, idempotency_key)
    @user = user
    @reward = reward
    @idempotency_key = idempotency_key
  end

  def redeem
    return false if Redemption.exists?(idempotency_key: @idempotency_key)

    raise "Insufficient points" unless @user.points >= @reward.points
    raise "Reward out of stock" unless @reward.stock > 0

    ActiveRecord::Base.transaction do
      @user.deduct_points!(@reward.points)
      @reward.update!(stock: @reward.stock - 1)
      Redemption.create!(user: @user, reward: @reward, idempotency_key: @idempotency_key)
    end

    true
  rescue StandardError => e
    Rails.logger.error("Redemption failed: #{e.message}")
    raise e
  end
end