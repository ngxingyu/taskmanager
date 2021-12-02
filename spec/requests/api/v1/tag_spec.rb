require "rails_helper"

RSpec.describe "Api::V1::Tags", type: :request do
  let!(:user) { create(:user, todo_lists_count: 3, todo_items_count: 4, tags_count: 2) }
  let(:headers) { valid_headers }
  describe "GET /index" do
    before { get "/api/v1/tags", headers: headers }
    it "returns items" do
      expect(json).not_to be_empty
      expect(json.size).to eq(6)
    end
    it "returns status code 200" do
      expect(response).to have_http_status(200)
    end
  end

end
