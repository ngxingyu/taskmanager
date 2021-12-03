require "rails_helper"

RSpec.describe "Api::V1::TodoLists", type: :request do
  let!(:user) { create(:user) }
  # let!(:todo_list_id) { user.todo_lists.first.id }
  let(:headers) { valid_headers }

  describe "GET /index" do
    before { get "/api/v1/todo_lists", headers: headers }
    it "returns lists" do
      expect(json).to be_empty
      expect(json.size).to eq(0)
    end
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
  end
  describe "GET /index with correct number of items" do
    before {
      create_list(:todo_list, 3, user: user)
      get "/api/v1/todo_lists", headers: headers
    }

    it "gets the correct number of items" do
      expect(json).not_to be_empty
      expect(json.size).to eq(3)
      expect(response).to have_http_status(200)
    end
  end
  describe "POST /api/v1/todo_lists updates tags, taggings" do
    before {
      params = { title: "a", description: "b", all_tags: "1, 2, 3" }
      post "/api/v1/todo_lists",
           params: params.to_json,
           headers: headers
    }

    it "gets the correct number of items" do
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["title"]).to eq("a")
      expect(json["description"]).to eq("b")
      expect(Tagging.where(todo_list_id: json["id"]).size).to eq(3)
      expect(Tag.find_by(id: Tagging.find_by(todo_list_id: json["id"]).tag_id).name).to eq("1")
      expect(TodoList.find_by(id: json["id"]).all_tags).to eq("1, 2, 3")
    end
  end

  describe "GET /api/v1/todo_lists/:id" do
    before(:each) {
      @user1 = create(:user)
      @x = TodoList.create(user: user, title: "A", description: "B")
      @y = TodoList.create(user: @user1, title: "C", description: "D")
    }

    it "returns the list for the current user" do
      get "/api/v1/todo_lists/#{@x[:id]}", headers: headers
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["title"]).to eq("A")
      expect(json["description"]).to eq("B")
    end
    it "does not return the list for another user" do
      get "/api/v1/todo_lists/#{@y[:id]}", headers: headers
      expect(JsonWebToken.decode(headers["Authorization"])['user_id']).to be(user.id)
      expect(response).to have_http_status(404)
    end
    it "returns the list for the other user" do
      @header1 = valid_headers(@user1)
      get "/api/v1/todo_lists/#{@y[:id]}", headers: @header1
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(JsonWebToken.decode(@header1["Authorization"])['user_id']).to be(@user1.id)
      expect(json["title"]).to eq("C")
      expect(json["description"]).to eq("D")
    end
  end
end
