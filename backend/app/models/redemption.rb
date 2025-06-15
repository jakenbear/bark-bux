# app/models/redemption.rb
# Handles the logic for when a user redeems a reward.

class Redemption < ApplicationRecord
  belongs_to :user
  belongs_to :reward

  # Make sure both user and reward are present
  validates :user_id, :reward_id, presence: true

  # Custom validations to check user's points and reward availability
  validate :user_has_enough_points
  validate :reward_has_stock

  # After a redemption is created, deduct points and reduce reward stock
  after_create :deduct_points_and_decrease_stock

  private

  # Checks if the user has enough points to redeem the reward
  def user_has_enough_points
    if user.points < reward.points
      errors.add(:user, "does not have enough points")
    end
  end

  # Ensures the reward has at least one item left in stock
  def reward_has_stock
    if reward.stock <= 0
      errors.add(:reward, "is out of stock")
    end
  end

  # Atomically updates user points and reward stock
  def deduct_points_and_decrease_stock
    user.with_lock do
      reward.with_lock do
        user.update!(points: user.points - reward.points)
        reward.update!(stock: reward.stock - 1)
      end
    end
  end
end

