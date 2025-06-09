class CreateRewards < ActiveRecord::Migration[8.0]
  def change
    create_table :rewards do |t|
      t.string :name
      t.text :description
      t.integer :points, default: 100
      t.integer :stock, default: 10

      t.timestamps
    end
  end
end
