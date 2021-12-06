class User < ApplicationRecord
  has_secure_password
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, length: { minimum: 5, maximum: 250 },
                    uniqueness: { case_sensitive: false }, format: { with: /\A[^@\s]+@[^@\s]+\z/, message: "Invalid email" }
  validates_presence_of :password_digest
  scope :filter_by_id, ->(user_id) { where user_id: user_id }
  has_many :project_user_roles, dependent: :destroy
  has_many :projects, through: :project_user_roles

  after_create :create_project

  ### creates project, assigns user as owner and returns the project.
  def create_project(name = "My Tasks")
    project = Project.new(name: name.strip)
    self.projects << project
    ProjectUserRole.where(user: self, project: project).update(role_id: 0)
    project
  end

  def to_h
    attributes.merge("all_projects" => all_projects)
  end

  private

  def all_projects
    self.projects.map(&:id)
  end
end
