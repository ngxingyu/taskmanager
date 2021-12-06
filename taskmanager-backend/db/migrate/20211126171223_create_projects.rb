class CreateProjects < ActiveRecord::Migration[6.1]
  def change
    create_table :projects do |t|
      t.string :name, null: false
      t.timestamps
    end
    create_table :project_user_roles do |t|
      t.belongs_to :project, null: false, foreign_key: { to_table: :projects }
      t.belongs_to :user, null: false, foreign_key: { to_table: :users }
      t.integer :role_id, null: false, default: 1 # Default Editor Role.

      t.timestamps
    end
  end
end
