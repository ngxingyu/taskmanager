require "rails_helper"

RSpec.describe "TodoLists", type: :request do
  let!(:todo_lists) { create_list(:todo_list, 5) }
  let!(:todo_list_id) { todo_lists.first.id }

  describe "GET /index" do
    before { get "/api/v1/todo_lists" }
    it "returns categories" do
      expect(json).not_to be_empty
      expect(json.size).to eq(5)
    end
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
  end
end
