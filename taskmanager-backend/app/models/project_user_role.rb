class ProjectUserRole < ApplicationRecord
  belongs_to :project, :foreign_key => :project_id
  belongs_to :user, :foreign_key => :user_id
end
