class CreateTaskTags < ActiveRecord::Migration[6.1]
  def change
    create_table :task_tags do |t|
      t.belongs_to :task, index: true
      t.belongs_to :tag, index: true

      t.timestamps
    end
    change_column_default :task_tags, :created_at, DateTime.now
    change_column_default :task_tags, :updated_at, DateTime.now
  end
end
