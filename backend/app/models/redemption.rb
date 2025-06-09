# app/models/redemption.rb
class Redemption < ApplicationRecord
  belongs_to :user
  belongs_to :reward

  validates :user_id, :reward_id, presence: true
  validate :user_has_enough_points
  validate :reward_has_stock

  after_create :deduct_points_and_decrease_stock

  private

  def user_has_enough_points
    if user.points < reward.points
      errors.add(:user, "does not have enough points")
    end
  end

  def reward_has_stock
    if reward.stock <= 0
      errors.add(:reward, "is out of stock")
    end
  end

  def deduct_points_and_decrease_stock
    user.with_lock do
      reward.with_lock do
        user.update!(points: user.points - reward.points)
        reward.update!(stock: reward.stock - 1)
      end
    end
  end
end
