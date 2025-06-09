# app/models/reward.rb
class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy
  has_many :users, through: :redemptions

  validates :name, :description, presence: true
  validates :points, :stock, numericality: { greater_than_or_equal_to: 0 }

  # Scope to get rewards that are available (stock > 0)
  scope :available, -> { where("stock > 0") }
end
