class CreateTaskTags < ActiveRecord::Migration[6.1]
  def change
    create_table :task_tags do |t|
      t.belongs_to :task, index: true
      t.belongs_to :tag, index: true

      t.timestamps
    end
    # change_column_default :task_tags, :created_at, -> { 'now()' }
    # change_column_default :task_tags, :created_at, -> { 'now()' }
    change_column :task_tags, :created_at, :datetime, null: false, default: -> { "CURRENT_TIMESTAMP" }
    change_column :task_tags, :updated_at, :datetime, null: false, default: -> { "CURRENT_TIMESTAMP" }
  end
end
