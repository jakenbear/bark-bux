# app/models/user.rb
class User < ApplicationRecord
  has_many :redemptions, dependent: :destroy
  has_many :rewards, through: :redemptions

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }

  # Scope to find users who have enough points to redeem a given reward
  scope :can_redeem_reward, ->(reward) { where("points >= ?", reward.points) }

  # Instance method to check if user can redeem a specific reward
  def can_redeem?(reward)
    points >= reward.points && reward.stock > 0
  end

  # Deduct points from user, raising error if insufficient points
  def deduct_points!(amount)
    raise "Insufficient points" if points < amount

    update!(points: points - amount)
  end
end


