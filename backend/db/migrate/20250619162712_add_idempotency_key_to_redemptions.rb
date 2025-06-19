class AddIdempotencyKeyToRedemptions < ActiveRecord::Migration[8.0]
  def change
    add_column :redemptions, :idempotency_key, :string
    add_index :redemptions, :idempotency_key, unique: true
  end
end
