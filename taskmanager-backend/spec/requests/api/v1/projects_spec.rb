require "rails_helper"

RSpec.describe "Api::V1::Project", type: :request do
  let!(:user) { create(:user, email: "user@email.com", projects_count: 1, tasks_count: 3, tags_count: 2) } # 2 projects including My Tasks
  let!(:user1) { create(:user, email: "user1@email.com") }
  let!(:admin) { create(:user, email: "admin@email.com", admin: true) }
  let(:headers) { valid_headers(user) }
  let(:admin_headers) { valid_headers(admin) }
  let(:user1_headers) { valid_headers(user1) }
  let(:valid_attributes) do
    attributes_for(:user, password: user.password, password_confirmation: user.password)
  end

  describe "GET /index (user)" do
    before { get "/api/v1/projects", headers: headers }
    it "returns projects list" do
      expect(json).not_to be_empty
    end
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
    it "returns the correct number of items" do
      expect(json.size).to eq(2)
    end
  end
  describe "GET /index (admin)" do
    before { get "/api/v1/projects", headers: admin_headers }
    it "returns projects list" do
      expect(json).not_to be_empty
    end
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
    it "returns the correct number of items" do
      expect(json.size).to eq(1)
    end
  end
  describe "POST /api/v1/projects updates project_user_roles with user as owner" do
    before {
      params = { name: "blah", permissions: [{ email: "user@email.com", role: 2 },
                                            { email: "user1@email.com", role: 2 },
                                            { email: "admin@email.com", role: 1 },
                                            { email: "missing@email.com", role: 1 }] }
      post "/api/v1/projects",
           params: params.to_json,
           headers: headers
      @user = User.find(user.id)
    }
    it "succeeds" do
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["name"]).to eq("blah")
    end
    it "creates the new project" do
      expect(@user.projects.count).to eq(3)
      expect(@user.projects.last.name).to eq("blah")
    end

    it "assigns the correct roles to the existing users" do
      users = Project.last.users
      expect(users.count).to eq(3)
      p = Project.last
      expect(user.project_user_roles.find_by(project_id: p).role_id).to eq(0)
      expect(user1.project_user_roles.find_by(project_id: p).role_id).to eq(2)
      expect(admin.project_user_roles.find_by(project_id: p).role_id).to eq(1)
    end
  end

  describe "GET /api/v1/projects/:id" do
    before {
      params = { name: "Project 1", permissions: [{ email: "admin@email.com", role: 1 }] }
      post "/api/v1/projects", params: params.to_json, headers: headers
      @project = Project.find_by(name:"Project 1")
      create(:task, subtasks: 2, depth: 4, project: @project)
    }

    it "returns the list for the current user" do
      get "/api/v1/projects/#{@project[:id]}", headers: headers
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["name"]).to eq("Project 1")
    end
    it "returns the list for admin in group" do
      get "/api/v1/projects/#{@project[:id]}", headers: admin_headers
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["name"]).to eq("Project 1")
    end
    it "does not return list for user outside group" do
      get "/api/v1/projects/#{@project[:id]}", headers: user1_headers
      expect(response).to have_http_status(401)
      expect(json).not_to be_empty
      expect(json["message"]).to eq("Unauthorized request")
    end
    it "returns the list for the current user" do
      get "/api/v1/projects/#{@project[:id]}?depth=1", headers: headers
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["name"]).to eq("Project 1")
      puts json
    end
  end
  # describe "update: PUT /api/v1/todo_items/:id" do
  #   before(:each) {
  #     @user1 = create(:user)
  #     @x = TodoList.create(user: user, title: "A", description: "B", all_tags: ["1", "2", "3"])
  #     @y = TodoList.create(user: @user1, title: "C", description: "D")
  #     @header1 = valid_headers(@user1)
  #   }

  #   it "modifies the list for the current user" do
  #     expect(TodoList.find_by(id: @x.id).title).to eq("A")
  #     expect(TodoList.find_by(id: @x.id).description).to eq("B")
  #     params = { title: "E", description: "F" }
  #     put "/api/v1/todo_lists/#{@x[:id]}", params: params.to_json, headers: headers
  #     expect(response).to have_http_status(204)
  #     expect(TodoList.find_by(id: @x.id).title).to eq("E")
  #     expect(TodoList.find_by(id: @x.id).description).to eq("F")
  #   end
  #   it "does not modify the list for the wrong user" do
  #     expect(TodoList.find_by(id: @x.id).title).to eq("A")
  #     expect(TodoList.find_by(id: @x.id).description).to eq("B")
  #     params = { title: "E", description: "F" }
  #     put "/api/v1/todo_lists/#{@x[:id]}", params: params.to_json, headers: @header1
  #     expect(response).to have_http_status(404)
  #     expect(TodoList.find_by(id: @x.id).title).to eq("A")
  #     expect(TodoList.find_by(id: @x.id).description).to eq("B")
  #   end
  #   it "modifies the taggings table properly" do
  #     expect(Tagging.where(todo_list_id: @x.id).count).to eq(3)
  #     params = { title: "E", description: "F" }
  #     put "/api/v1/todo_lists/#{@x[:id]}", params: params.to_json, headers: headers
  #     expect(Tagging.where(todo_list_id: @x.id).count).to eq(3)
  #     params = { all_tags: [] }
  #     put "/api/v1/todo_lists/#{@x[:id]}", params: params.to_json, headers: headers
  #     expect(Tagging.where(todo_list_id: @x.id).count).to eq(0)
  #     params = { all_tags: ["1"] }
  #     put "/api/v1/todo_lists/#{@x[:id]}", params: params.to_json, headers: headers
  #     expect(Tagging.where(todo_list_id: @x.id).count).to eq(1)
  #   end
  # end
  # describe "delete: DELETE /api/v1/todo_lists/:id" do
  #   before(:each) {
  #     @user1 = create(:user)
  #     @x = TodoList.create(user: user, title: "A", description: "B", all_tags: ["1", "2", "3"])
  #     @y = TodoList.create(user: @user1, title: "C", description: "D")
  #     @header1 = valid_headers(@user1)
  #   }

  #   it "deletes the list for the current user" do
  #     delete "/api/v1/todo_lists/#{@x[:id]}", headers: headers
  #     expect(response).to have_http_status(204)
  #     expect(TodoList.where(id: @x.id).count).to eq(0)
  #   end
  #   it "does not delete the list for the wrong user" do
  #     delete "/api/v1/todo_lists/#{@x[:id]}", headers: @header1
  #     expect(response).to have_http_status(404)
  #     expect(TodoList.where(id: @x.id).count).to eq(1)
  #   end
  #   it "modifies the taggings table properly" do
  #     expect(Tagging.where(todo_list_id: @x.id).count).to eq(3)
  #     delete "/api/v1/todo_lists/#{@x[:id]}", headers: headers
  #     expect(Tagging.where(todo_list_id: @x.id).count).to eq(0)
  #   end
  # end
end
