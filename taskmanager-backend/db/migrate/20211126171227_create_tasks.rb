class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.string :notes, default: ""
      t.boolean :completed, default: false
      t.datetime :start_at, default: -> { "CURRENT_TIMESTAMP" }
      t.integer :duration, default: 60
      t.integer :importance, default: 1
      t.belongs_to :task_status,  null: false
      t.belongs_to :project, null: false, foreign_key: true
      t.belongs_to :parent, null: true, foreign_key: { to_table: :tasks }

      t.timestamps
    end
    # add_foreign_key(:tasks, :tasks, column: :parent_id)
  end
end
