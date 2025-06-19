# app/serializers/reward_serializer.rb
class RewardSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :points, :stock
end
