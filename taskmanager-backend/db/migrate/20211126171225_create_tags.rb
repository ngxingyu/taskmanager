class CreateTags < ActiveRecord::Migration[6.1]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.belongs_to :project, null: false, foreign_key: { to_table: :projects }

      t.timestamps
    end
    add_index :tags, [:name, :project_id], unique: true
  end
end
