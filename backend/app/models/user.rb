# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :redemptions, dependent: :destroy
  has_many :rewards, through: :redemptions

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }

  scope :can_redeem, ->(reward) { where("points >= ?", reward.points) }

  def can_redeem?(reward)
    points >= reward.points && reward.stock > 0
  end

  def deduct_points!(amount)
    raise "Insufficient points" if points < amount
    update!(points: points - amount)
  end
end