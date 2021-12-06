require "rails_helper"

RSpec.describe Project, type: :model do
  it { should have_many(:users) }
  it { should have_many(:project_user_roles) }
  it { should have_many(:tasks) }
  it { should have_many(:tags) }

  let!(:user) { create(:user) } # 2 projects including My Tasks
  describe "n-level get_tasks retrieval" do
    before {
      @project = user.projects.first
      @tasks = @project.tasks
      expect(@project.name).to eq("My Tasks")
      expect(@project.get_tasks().count).to eq (0)
      create(:task, subtasks: 2, depth: 4, project: @project)
    }
    it "retrieves correct count for various calls for binary tree" do
      expect(@project.get_tasks().count).to eq(1)
      expect(@project.get_tasks(nil, 2).count).to eq(3)
      expect(@project.get_tasks(nil, 3).count).to eq(7)
      expect(@project.get_tasks(nil, 4).count).to eq(15)
      expect(@project.get_tasks(nil, 5).count).to eq(15)
      expect(@project.get_tasks(nil, -1).count).to eq(1)
      expect(@project.get_tasks(@tasks.first.children.first, 5).count).to eq(7)
    end
  end
end
