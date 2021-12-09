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
    add_index :project_user_roles, [:project_id, :user_id], unique: true
    # change_column_default :project_user_roles, :created_at, -> { 'now' }
    # change_column_default :project_user_roles, :updated_at, -> { 'now' }
    change_column :project_user_roles, :created_at, :datetime, null: false, default: -> { "CURRENT_TIMESTAMP" }
    change_column :project_user_roles, :updated_at, :datetime, null: false, default: -> { "CURRENT_TIMESTAMP" }
  end
end
