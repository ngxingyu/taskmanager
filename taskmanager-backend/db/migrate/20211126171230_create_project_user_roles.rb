class CreateProjectUserRoles < ActiveRecord::Migration[6.1]
  def change
    create_table :project_user_roles do |t|
      t.belongs_to :project, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :role, null: false

      t.timestamps
    end
  end
end
