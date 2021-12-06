class Project < ApplicationRecord
  has_many :project_user_roles, dependent: :destroy
  has_many :users, through: :project_user_roles
  has_many :tasks
  has_many :tags
  attr_reader :all_users
end
