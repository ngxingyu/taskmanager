class CreateTags < ActiveRecord::Migration[6.1]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
    add_index :tags, :name
  end
end
