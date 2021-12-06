class CreateTaskTags < ActiveRecord::Migration[6.1]
  def change
    create_table :task_tags do |t|
      t.belongs_to :task, null: false, foreign_key: { to_table: :tasks }
      t.belongs_to :tag, null: false, foreign_key: { to_table: :tags }

      t.timestamps
    end
  end
end
