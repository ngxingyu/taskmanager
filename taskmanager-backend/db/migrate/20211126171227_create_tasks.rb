class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.string :notes, default: ""
      t.datetime :start_at, default: -> { "CURRENT_TIMESTAMP" }
      t.integer :duration, default: 60
      t.integer :importance, default: 1
      t.integer :task_status_id,  null: false, default: 0 # Default To Do, id: 0
      t.belongs_to :project, null: false, foreign_key: { to_table: :projects }
      t.belongs_to :parent, null: true

      t.timestamps
    end
    add_foreign_key(:tasks, :tasks, column: :parent_id)
  end
end
