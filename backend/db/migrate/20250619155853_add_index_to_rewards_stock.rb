class AddIndexToRewardsStock < ActiveRecord::Migration[8.0]
  def change
    add_index :rewards, :stock
  end
end
