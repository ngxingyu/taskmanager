require 'factory_bot_rails'
require 'faker'

roles = Role.create([{name: "Owner"}, {name: "Editor"}, {name: "Viewer"}])
admin = User.create(name: "admin", email: "admin@admin.admin", password: "password", admin: true)
task_statuses = TaskStatus.create([{name: "To Do"}, {name: "In Progress"}, {name: "Completed"}])
# users = FactoryBot.create_list(:user, 2, todo_lists_count: 3, todo_items_count: 4, tags_count: 2)

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
