class CreateProjectUserRoles < ActiveRecord::Migration[6.1]
  def change
    create_table :project_user_roles do |t|
      t.belongs_to :project, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.integer :role_id, null: false, default: 1 # Default Editor Role.

      t.timestamps
    end
  end
end
