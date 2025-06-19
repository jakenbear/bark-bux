# app/serializers/redemption_serializer.rb
class RedemptionSerializer < ActiveModel::Serializer
  attributes :id, :redeemed_at, :created_at
  belongs_to :reward
end