require "rails_helper"

RSpec.describe "Api::V1::Tasks", type: :request do
  let!(:user) { create(:user, email: "user@email.com") }
  let!(:user1) { create(:user, email: "user1@email.com") }
  let!(:admin) { create(:user, email: "admin@email.com", admin: true) }
  let(:headers) { valid_headers(user) }
  let(:admin_headers) { valid_headers(admin) }
  let(:user1_headers) { valid_headers(user1) }
  let!(:project) { user.projects.first }

  describe "GET /index" do
    before {
      create(:task, subtasks: 2, depth: 4, project: project)
    }
    it "returns the list of depth 2 for the current project" do
      get "/api/v1/projects/#{project.id}/tasks", headers: headers
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json.length).to eq(3)
    end
    it "does not return list for user outside group" do
      get "/api/v1/projects/#{project.id}/tasks", headers: user1_headers
      expect(response).to have_http_status(401)
      expect(json).not_to be_empty
      expect(json["message"]).to eq("Unauthorized request")
    end
    it "returns list of correct length" do
      get "/api/v1/projects/#{project.id}/tasks?depth=1", headers: headers
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json.length).to eq(1)
      get "/api/v1/projects/#{project.id}/tasks?depth=2", headers: headers
      expect(json.length).to eq(3)
      get "/api/v1/projects/#{project.id}/tasks?depth=3", headers: headers
      expect(json.length).to eq(7)
      get "/api/v1/projects/#{project.id}/tasks?depth=4", headers: headers
      expect(json.length).to eq(15)
      get "/api/v1/projects/#{project.id}/tasks?depth=5", headers: headers
      expect(json.length).to eq(15)
      get "/api/v1/projects/#{project.id}/tasks?depth=5&parent_id=#{project.tasks.first.children.first.id}", headers: headers
      expect(json.length).to eq(7)
    end
  end
  describe "GET /index query" do
    before {
      params = { title: "banana", notes: "moderna", all_tags: ["1", "2", "3"] }
      post "/api/v1/projects/#{project.id}/tasks",
           params: params.to_json,
           headers: headers
      params = { title: "pfizer", notes: "apple", all_tags: ["zzz", "yyy", "xxx"] }
      post "/api/v1/projects/#{project.id}/tasks",
           params: params.to_json,
           headers: headers
      params = { title: "ana", notes: "apple", all_tags: ["1", "yyy"] }
      post "/api/v1/projects/#{project.id}/tasks",
           params: params.to_json,
           headers: headers
    }

    it "gets the correct number of items" do
      expect(TaskTag.where(task_id: json["id"]).size).to eq(2)
      expect(Tag.where(project_id: project.id).size).to eq(6)
      get "/api/v1/projects/#{project.id}/tasks?query=ap", headers: headers
      expect(json.length).to eq(2)
      get "/api/v1/projects/#{project.id}/tasks?all_tags[]=yyy&all_tags[]=1", headers: headers
      expect(json.length).to eq(3)
      get "/api/v1/projects/#{project.id}/tasks?query=moderna&all_tags[]=xxx", headers: headers
      expect(json.length).to eq(2)
    end
  end

  describe "POST /api/v1/tasks updates tags, task_tags" do
    before {
      params = { title: "a", notes: "b", all_tags: ["1", "2", "3"] }
      post "/api/v1/projects/#{project.id}/tasks",
           params: params.to_json,
           headers: headers
    }

    it "gets the correct number of items" do
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["title"]).to eq("a")
      expect(json["notes"]).to eq("b")

      expect(TaskTag.where(task_id: json["id"]).size).to eq(3)
      expect(Tag.find_by(id: TaskTag.find_by(task_id: json["id"]).tag_id).name).to eq("1")
      expect(Task.find_by(id: json["id"]).all_tags).to eq(["1", "2", "3"])

      task = Task.where(title: "a").first
      params = { title: "c", notes: "d", parent_id: task.id, all_tags: ["4"] }
      post "/api/v1/projects/#{project.id}/tasks",
           params: params.to_json,
           headers: headers
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["title"]).to eq("c")
      expect(json["notes"]).to eq("d")
      expect(TaskTag.where(task_id: json["id"]).size).to eq(1)
      expect(Task.find_by(id: json["id"]).all_tags).to eq(["4"])
      expect(Task.find_by(id: json["id"]).parent_id).to eq(task.id)
    end
  end

  describe "GET /api/v1/tasks/:id" do
    before(:each) {
      params = { title: "a", notes: "b", all_tags: ["1", "2", "3"] }
      post "/api/v1/projects/#{project.id}/tasks",
           params: params.to_json,
           headers: headers
      @task = Task.last
    }

    it "returns the task for the current user" do
      get "/api/v1/tasks/#{@task.id}", headers: headers
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["title"]).to eq("a")
      expect(json["notes"]).to eq("b")
      expect(json["all_tags"]).to eq(["1", "2", "3"])
    end
    it "does not return the list for another user" do
      get "/api/v1/tasks/#{@task.id}", headers: admin_headers
      expect(JsonWebToken.decode(headers["Authorization"])["user_id"]).to be(user.id)
      expect(response).to have_http_status(401)
    end
  end
  describe "update: PUT /api/v1/tasks/:id" do
    before(:each) {
      @user1 = create(:user)
      @x = Task.create(project: project, title: "A", notes: "B", all_tags: ["1", "2", "3"])
      @y = Task.create(project: @user1.projects.first, title: "C", notes: "D")
      @header1 = valid_headers(@user1)
    }

    it "modifies the list for the current user" do
      expect(Task.find_by(id: @x.id).title).to eq("A")
      expect(Task.find_by(id: @x.id).notes).to eq("B")
      params = { title: "E", notes: "F" }
      put "/api/v1/tasks/#{@x[:id]}", params: params.to_json, headers: headers
      expect(response).to have_http_status(204)
      expect(Task.find_by(id: @x.id).title).to eq("E")
      expect(Task.find_by(id: @x.id).notes).to eq("F")
    end
    it "does not modify the list for the wrong user" do
      expect(Task.find_by(id: @x.id).title).to eq("A")
      expect(Task.find_by(id: @x.id).notes).to eq("B")
      params = { title: "E", notes: "F" }
      put "/api/v1/tasks/#{@x[:id]}", params: params.to_json, headers: @header1
      expect(response).to have_http_status(401)
      expect(Task.find_by(id: @x.id).title).to eq("A")
      expect(Task.find_by(id: @x.id).notes).to eq("B")
    end
    it "modifies the TaskTags table properly" do
      expect(TaskTag.where(task_id: @x.id).count).to eq(3)
      params = { title: "E", notes: "F" }
      put "/api/v1/tasks/#{@x[:id]}", params: params.to_json, headers: headers
      expect(TaskTag.where(task_id: @x.id).count).to eq(3)
      params = { all_tags: [] }
      put "/api/v1/tasks/#{@x[:id]}", params: params.to_json, headers: headers
      expect(TaskTag.where(task_id: @x.id).count).to eq(0)
      params = { all_tags: ["1"] }
      put "/api/v1/tasks/#{@x[:id]}", params: params.to_json, headers: headers
      expect(TaskTag.where(task_id: @x.id).count).to eq(1)
    end
  end
  describe "delete: DELETE /api/v1/tasks/:id" do
    before(:each) {
      @user1 = create(:user)
      @x = Task.create(project: project, title: "A", notes: "B", all_tags: ["1", "2", "3"])
      @y = Task.create(project: @user1.projects.first, title: "C", notes: "D")
      @header1 = valid_headers(@user1)
    }

    it "deletes the list for the current user" do
      delete "/api/v1/tasks/#{@x[:id]}", headers: headers
      expect(response).to have_http_status(204)
      expect(Task.where(id: @x.id).count).to eq(0)
    end
    it "does not delete the list for the wrong user" do
      delete "/api/v1/tasks/#{@x[:id]}", headers: @header1
      expect(response).to have_http_status(401)
      expect(Task.where(id: @x.id).count).to eq(1)
    end
    it "modifies the TaskTags table properly" do
      expect(TaskTag.where(task_id: @x.id).count).to eq(3)
      delete "/api/v1/tasks/#{@x[:id]}", headers: headers
      expect(TaskTag.where(task_id: @x.id).count).to eq(0)
    end
  end
end
