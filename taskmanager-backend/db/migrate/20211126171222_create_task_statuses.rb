class CreateTaskStatuses < ActiveRecord::Migration[6.1]
  def change
    create_table :task_statuses do |t|
      t.string :name, null: false
      t.timestamps
    end
    add_index :task_statuses, :name, unique: true
  end
end
