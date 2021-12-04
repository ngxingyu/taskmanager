class CreateTodoItems < ActiveRecord::Migration[6.1]
  def change
    create_table :todo_items do |t|
      t.string :title
      t.string :description
      t.string :notes, default: ""
      t.boolean :completed, default: false
      t.datetime :start_at, default: -> { "CURRENT_TIMESTAMP" }
      t.integer :duration, default: 60
      t.integer :importance, default: 1
      t.belongs_to :todo_list, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
