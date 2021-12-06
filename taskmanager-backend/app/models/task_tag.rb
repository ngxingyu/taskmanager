class TaskTag < ApplicationRecord
  belongs_to :task, :foreign_key => :task_id
  belongs_to :tag, :foreign_key => :tag_id
end
