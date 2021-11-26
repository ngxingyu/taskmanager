class Tag < ApplicationRecord
  belongs_to :user
  has_many :taggings
  has_many :todo_lists, :through => :taggings
end
