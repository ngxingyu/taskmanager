require "rails_helper"

RSpec.describe "Api::V1::TodoItems", type: :request do
  let!(:user) { create(:user, todo_lists_count: 3, todo_items_count: 4) }
  let!(:admin) { create(:user, admin: true, todo_lists_count: 3, todo_items_count: 4) }
  let!(:todo_list_id) { TodoList.where(user_id: user.id).first.id }
  let!(:admin_todo_list_id) { TodoList.where(user_id: admin.id).first.id }
  let(:headers) { valid_headers(user) }
  let(:headersadmin) { valid_headers(admin) }

  describe "GET /index" do
    context "current user" do
      before { get "/api/v1/todo_items", headers: headers }
      it "returns items" do
        expect(json).not_to be_empty
        expect(json.size).to eq(12)
      end
      it "returns status code 200" do
        expect(response).to have_http_status(200)
      end
    end
    context "current user get admin" do
      before { get "/api/v1/todo_items?user_id=#{admin.id}", headers: headers }
      it "returns status code 401" do
        expect(response).to have_http_status(401)
      end
    end
    context "admin" do
      before { get "/api/v1/todo_items?user_id=#{user.id}", headers: headersadmin }
      it "returns items" do
        expect(json).not_to be_empty
        expect(json.size).to eq(12)
      end
      it "returns status code 200" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "POST /api/v1/todo_items" do
    before {
      expect(TodoItem.where(todo_list_id: todo_list_id).count).to eq(4)
      @now = Time.now.utc
      params = { title: "titl", description: "des", start_at: @now, todo_list_id: todo_list_id }
      post "/api/v1/todo_items", params: params.to_json, headers: headers
    }
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
    it "fills the correct defaults" do
      @item = TodoItem.where(todo_list_id: todo_list_id).last
      expect(@item.title).to eq("titl")
      expect(@item.description).to eq("des")
      expect(@item.completed).to eq(false)
      expect(@item.importance).to eq(1)
      expect(@item.duration).to eq(60)
      expect(@item.start_at.day).to eq(@now.day)
    end
  end

  describe "GET /api/v1/todo_items/:id" do
    context "item exists" do
      before {
        @todo = TodoItem.where(todo_list_id: todo_list_id).first
        get "/api/v1/todo_items/#{@todo.id}", headers: headers
      }
      it "returns items" do
        expect(json).not_to be_empty
        expect(json["id"].to_i).to eq(@todo.id)
        expect(json["todo_list_id"].to_i).to eq(todo_list_id)
        expect(json["notes"]).to eq(@todo.notes)
        expect(json["title"]).to eq(@todo.title)
      end
      it "returns status code 200" do
        expect(response).to have_http_status(200)
      end
    end
    context "item doesn't exist" do
      before {
        @todo = TodoItem.where(todo_list_id: admin_todo_list_id).first
        get "/api/v1/todo_items/#{@todo.id}", headers: headers
      }
      it "returns items" do
        expect(json["message"]).to eq("Couldn't find TodoItem with 'id'=#{@todo.id} [WHERE \"todo_items\".\"user_id\" = ?]")
      end
      it "returns status code 404" do
        expect(response).to have_http_status(404)
      end
    end
  end
  describe "PUT /api/v1/todo_items/:id" do
    context "current user" do
      before {
        @todo = TodoItem.where(todo_list_id: todo_list_id).first
        params = { notes: "<x>", description: "new_desc" }
        put "/api/v1/todo_items/#{@todo.id}", params: params.to_json, headers: headers
      }
      it "returns status code 200" do
        expect(response).to have_http_status(204)
      end
      it "returns items" do
        @todo1 = TodoItem.where(todo_list_id: todo_list_id).first
        expect(@todo1.notes).to eq("<x>")
        expect(@todo1["description"]).to eq("new_desc")
        expect(@todo1["title"]).to eq(@todo.title)
      end
    end
    context "other user" do
      before {
        @todo1 = TodoItem.find_by(todo_list_id: admin_todo_list_id)
        params = { notes: "<x>", description: "new_desc" }
        put "/api/v1/todo_items/#{@todo1.id}", params: params.to_json, headers: headers
      }
      it "returns status code 401" do
        expect(response).to have_http_status(401)
      end
    end
  end
  describe "DELETE /api/v1/todo_items/:id" do
    context "current user" do
      before {
        @todo = TodoItem.where(todo_list_id: todo_list_id).first
        delete "/api/v1/todo_items/#{@todo.id}", headers: headers
      }
      it "returns status code 204" do
        expect(response).to have_http_status(204)
      end
      it "deletes the item" do
        expect(TodoItem.where(id: @todo.id).count).to eq(0)
      end
    end
    before {
      @todo1 = TodoItem.find_by(todo_list_id: admin_todo_list_id)
      delete "/api/v1/todo_items/#{@todo1.id}", headers: headers
    }
    it "returns status code 401" do
      expect(response).to have_http_status(401)
    end
    it "does not delete the item" do
      expect(TodoItem.where(id: @todo1.id).count).to eq(1)
    end
  end
end
