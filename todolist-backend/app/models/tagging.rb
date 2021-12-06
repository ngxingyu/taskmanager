class Tagging < ApplicationRecord
  belongs_to :todo_list
  belongs_to :tag
end
