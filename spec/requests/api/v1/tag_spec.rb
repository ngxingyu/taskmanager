require "rails_helper"

RSpec.describe "Api::V1::Tags", type: :request do
  let!(:user) { create(:user, todo_lists_count: 2, tags_count: 3) }
  let!(:admin) { create(:user, admin: true, todo_lists_count: 2, tags_count: 3) }
  let!(:headers) { valid_headers(user) }
  let!(:headersadmin) { valid_headers(admin) }
  describe "GET /index" do
    context "user" do
      before {
        create_list(:tag, 3, user: user)
        get "/api/v1/tags", headers: headers
      }
      it "returns items" do
        expect(json).not_to be_empty
        expect(json.size).to eq(9)
        expect(response).to have_http_status(200)
      end
    end
  end
  describe "GET /index?user_id=??" do
    context "admin" do
      it "user view user" do
        get "/api/v1/tags?user_id=#{user.id}", headers: headers
        expect(json).not_to be_empty
        expect(json.size).to eq(6)
        expect(response).to have_http_status(200)
      end
      it "user view admin" do
        get "/api/v1/tags?user_id=#{admin.id}", headers: headers
        expect(response).to have_http_status(401)
      end
      it "admin view user" do
        get "/api/v1/tags?user_id=#{user.id}", headers: headersadmin
        expect(json).not_to be_empty
        expect(json.size).to eq(6)
        expect(response).to have_http_status(200)
      end
    end
  end
  describe "POST /api/v1/tags" do
    before {
      post "/api/v1/tags", params: { name: "test" }.to_json, headers: headers
    }
    it "does not add existing tag" do
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["name"]).to eq("test")
      expect(Tag.where(user_id: user.id).count).to eq(7)
    end
  end
  describe "POST /api/v1/tags repeated tags" do
    before {
      post "/api/v1/tags", params: { name: "test1" }.to_json, headers: headers
      post "/api/v1/tags", params: { name: "test1" }.to_json, headers: headers
    }
    it "allows duplicate" do
      expect(response).to have_http_status(200)
      expect(Tag.where(user_id: user.id).count).to eq(8)
    end
  end
  describe "GET /api/v1/tags/:ids" do
    context "user" do
      before {
        @tag1 = create(:tag, name: "test3", user: user)
        @tag2 = create(:tag, name: "test4", user: admin)
      }
      it "can find own tag" do
        get "/api/v1/tags/#{@tag1.id}", headers: headers
        expect(response).to have_http_status(200)
        expect(json).not_to be_empty
        expect(json["name"]).to eq("test3")
      end
      it "doesn't get other's tag" do
        get "/api/v1/tags/#{@tag2.id}", headers: headers
        expect(response).to have_http_status(200)
        expect(json).to be(nil)
      end
    end
  end
  describe "PUT /api/v1/tags/:id" do
    context "user" do
      before {
        @tag1 = create(:tag, name: "test3", user: user)
        @tag2 = create(:tag, name: "test4", user: admin)
      }
      it "can edit own tag" do
        put "/api/v1/tags/#{@tag1.id}", params: { name: "test4" }.to_json, headers: headers
        expect(response).to have_http_status(204)
      end
      it "doesn't get other's tag" do
        put "/api/v1/tags/#{@tag2.id}", params: { name: "test5" }.to_json, headers: headers
        expect(Tag.find_by(id: @tag2.id).name).to eq("test4")
      end
    end
  end
  describe "DELETE /api/v1/tags/tag_id" do
    context "user" do
      before { }
      it "can delete tags and taggings for todo_list" do
        @tag = Tag.where(user_id: user.id).first
        expect(Tagging.where(tag_id: @tag.id).count).to eq(1)
        delete "/api/v1/tags/#{@tag.id}", headers: headers
        expect(response).to have_http_status(204)
        expect(Tagging.where(tag_id: @tag.id).count).to eq(0)
      end
      it "same for admin" do
        @tag = Tag.where(user_id: user.id).first
        expect(Tagging.where(tag_id: @tag.id).count).to eq(1)
        delete "/api/v1/tags/#{@tag.id}", headers: headersadmin
        expect(response).to have_http_status(204)
        expect(Tagging.where(tag_id: @tag.id).count).to eq(0)
      end
      it "user cannot delete others" do
        @tag = Tag.where(user_id: admin.id).first
        expect(Tagging.where(tag_id: @tag.id).count).to eq(1)
        delete "/api/v1/tags/#{@tag.id}", headers: headers
        expect(response).to have_http_status(204)
        expect(Tagging.where(tag_id: @tag.id).count).to eq(1)
      end
    end
  end
end
