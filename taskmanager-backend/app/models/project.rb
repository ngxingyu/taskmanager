class Project < ApplicationRecord
  has_many :project_user_roles, dependent: :destroy
  has_many :users, through: :project_user_roles
  has_many :tasks
  has_many :tags

  def permissions
    self.project_user_roles.map { |u|
      { email: u.user.email, role: u.role_id }
    }
  end

  ### Returns tasks depth-level deep from a given parent
  ### E.g. depth of 2 returns the top-most list of tasks for the project,
  ### and the list of subtasks for each task.
  def get_tasks(parent: nil, depth: 1)
    @res = Array.new()

    def helper(parent, depth, tasks)
      if (parent.nil?)
        (tasks.select { |task| task.parent.nil? }).each do |task|
          helper(task, depth - 1, tasks)
        end unless tasks.nil?
      else
        @res.push(parent)
        (parent.children).each do |child|
          helper(child, depth - 1, tasks)
        end unless (depth == 0)
      end
    end

    helper(parent, [depth, 1].max, Task.where(project: self))
    @res
  end

  def to_h(depth: 0, parent_id: nil)
    res = attributes.merge("permissions" => permissions)
    parents = tasks.where(id: parent_id)
    parent = (parent_id.nil? || parents.empty?) ? nil : parents.first
    depth == 0 ? res : res.merge("tasks" => get_tasks(depth: depth, parent: parent))
  end
end
