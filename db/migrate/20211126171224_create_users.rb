class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :name, null: false
      t.string :password_digest
      t.boolean :verified, default: false
      t.boolean :admin, default: false

      t.timestamps
    end
  end
end
