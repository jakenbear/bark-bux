# app/models/redemption.rb
class Redemption < ApplicationRecord
  belongs_to :user
  belongs_to :reward
  validates :user_id, :reward_id, :idempotency_key, presence: true
  validates :idempotency_key, uniqueness: true
end