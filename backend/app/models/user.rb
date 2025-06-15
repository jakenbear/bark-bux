# app/models/user.rb
# Represents an application user who can redeem rewards with points.

class User < ApplicationRecord
  has_many :redemptions, dependent: :destroy
  has_many :rewards, through: :redemptions

  # Require name and a unique email (case-insensitive)
  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }

  # Returns users who have enough points to redeem the given reward
  scope :can_redeem_reward, ->(reward) { where("points >= ?", reward.points) }

  # Checks if this user can redeem a specific reward
  def can_redeem?(reward)
    points >= reward.points && reward.stock > 0
  end

  # Deducts a number of points from the user, raises an error if not enough points
  def deduct_points!(amount)
    raise "Insufficient points" if points < amount

    update!(points: points - amount)
  end
end



