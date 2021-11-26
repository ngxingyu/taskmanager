require 'rails_helper'

RSpec.describe "Tags", type: :request do
  describe "GET /name:string:index" do
    it "returns http success" do
      get "/tag/name:string:index"
      expect(response).to have_http_status(:success)
    end
  end

end
