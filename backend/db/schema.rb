# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_19_162712) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "redemptions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "reward_id", null: false
    t.datetime "redeemed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "idempotency_key"
    t.index ["idempotency_key"], name: "index_redemptions_on_idempotency_key", unique: true
    t.index ["reward_id"], name: "index_redemptions_on_reward_id"
    t.index ["user_id"], name: "index_redemptions_on_user_id"
  end

  create_table "rewards", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "points", default: 100
    t.integer "stock", default: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["stock"], name: "index_rewards_on_stock"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.integer "points", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "redemptions", "rewards"
  add_foreign_key "redemptions", "users"
end
