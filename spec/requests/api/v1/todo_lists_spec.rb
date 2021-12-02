require "rails_helper"

RSpec.describe "Api::V1::TodoLists", type: :request do
  let!(:user) { create(:user, todo_lists_count: 3, todo_items_count: 4, tags_count: 2) }
  # let!(:todo_list_id) { user.todo_lists.first.id }
  let(:headers) { valid_headers }

  describe "GET /index" do
    before { get "/api/v1/todo_lists", headers: headers }
    it "returns lists" do
      expect(json).not_to be_empty
      expect(json.size).to eq(3)
    end
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
  end
end
