class Project < ApplicationRecord
  has_many :project_user_roles, dependent: :destroy
  has_many :users, through: :project_user_roles
  has_many :tasks
  has_many :tags
  attr_reader :permissions

  def permissions
    self.project_user_roles.map { |u|
      { email: u.user.email, role: u.role_id }
    }
  end

  def to_h
    attributes.merge("permissions" => permissions)
  end
end
