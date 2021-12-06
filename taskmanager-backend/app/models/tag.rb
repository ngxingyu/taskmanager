class Tag < ApplicationRecord
  belongs_to :project,  :foreign_key => :project_id
  has_many :task_tags, dependent: :destroy
  has_many :tasks, through: :task_tags
end
