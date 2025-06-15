# app/models/reward.rb
# Represents a redeemable reward in the system.

class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy
  has_many :users, through: :redemptions

  # Ensure name and description are present
  validates :name, :description, presence: true

  # Points and stock must be non-negative numbers
  validates :points, :stock, numericality: { greater_than_or_equal_to: 0 }

  # Fetch only rewards that still have stock available
  scope :available, -> { where("stock > 0") }
end

