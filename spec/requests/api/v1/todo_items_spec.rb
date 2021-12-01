require "rails_helper"

RSpec.describe "Api::V1::TodoItems", type: :request do
  let!(:user) { create(:user, todo_lists_count: 3, todo_items_count: 4, tags_count: 2) }
  let!(:todo_list_id) { TodoList.first.id }

  describe "GET /index" do
    before { get "/api/v1/todo_items" }
    it "returns items" do
      expect(json).not_to be_empty
      expect(json.size).to eq(12)
    end
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
  end

  # describe "GET /title:string" do
  #   it "returns http success" do
  #     get "/api/v1/todo_items/#{todo_list_id}/title:string"
  #     expect(response).to have_http_status(:success)
  #   end
  # end
end
