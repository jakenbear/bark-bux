# app/models/reward.rb
class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy
  has_many :users, through: :redemptions
  validates :name, :description, presence: true
  validates :points, :stock, numericality: { greater_than_or_equal_to: 0 }
  scope :available, -> { where("stock > 0") }
  after_save :clear_rewards_cache

  private

  def clear_rewards_cache
    Rails.cache.delete("rewards_available")
  end
end

