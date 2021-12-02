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

ActiveRecord::Schema.define(version: 2021_11_26_171228) do

  create_table "taggings", force: :cascade do |t|
    t.integer "todo_list_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["todo_list_id"], name: "index_taggings_on_todo_list_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_tags_on_name"
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "todo_items", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.boolean "completed"
    t.datetime "start_at"
    t.time "duration"
    t.integer "importance", default: 1
    t.integer "todo_list_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["todo_list_id"], name: "index_todo_items_on_todo_list_id"
    t.index ["user_id"], name: "index_todo_items_on_user_id"
  end

  create_table "todo_lists", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_todo_lists_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest"
    t.boolean "verified", default: false
    t.boolean "admin", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "taggings", "tags"
  add_foreign_key "taggings", "todo_lists"
  add_foreign_key "tags", "users"
  add_foreign_key "todo_items", "todo_lists"
  add_foreign_key "todo_items", "users"
  add_foreign_key "todo_lists", "users"
end
