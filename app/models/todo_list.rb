class TodoList < ApplicationRecord
  belongs_to :user
  has_many :todo_items
  has_many :taggings
  has_many :tags, :through => :taggings
end
