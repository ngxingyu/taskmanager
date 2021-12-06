class Project < ApplicationRecord
  has_many :project_user_roles, dependent: :destroy
  has_many :users, through: :project_user_roles
  attr_reader :all_users
end
