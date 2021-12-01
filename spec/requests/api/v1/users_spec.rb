require "rails_helper"

RSpec.describe "Api::V1::Users", type: :request do
  let!(:users) { create_list(:user, 5, todo_lists_count: 1, todo_items_count: 1, tags_count: 1) }
  let!(:user_id) { users.first.id }

  describe "GET /index" do
    before { get "/api/v1/users?user_id=#{user_id}" }
    it "returns users" do
      expect(json).not_to be_empty
      expect(json.size).to eq(5)
    end
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
  end
end
