class Tag < ApplicationRecord
  belongs_to :user
  has_many :taggings#, inverse_of: :tag
  has_many :todo_lists, through: :taggings
end
