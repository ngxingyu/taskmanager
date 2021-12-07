require "rails_helper"

RSpec.describe "Api::V1::Tags", type: :request do
  let!(:user) { create(:user, email: "user@email.com", projects_count: 1, tags_count: 3) }
  let!(:admin) { create(:user, email: "admin@email.com", admin: true) }
  let!(:headers) { valid_headers(user) }
  let!(:admin_headers) { valid_headers(admin) }
  let!(:project) { user.projects.first }
  let!(:admin_project) { admin.projects.first }
  describe "GET /index" do
    context "user" do
      before {
        create_list(:tag, 3, project: project)
        get "/api/v1/projects/#{project.id}/tags", headers: headers
      }
      it "returns items" do
        expect(json).not_to be_empty
        expect(json.size).to eq(3)
        expect(response).to have_http_status(200)
      end
    end
  end
  describe "POST /api/v1/projects/:project_id/tags" do
    before {
      create_list(:tag, 3, project: project)
      post "/api/v1/projects/#{project.id}/tags", params: { name: "test" }.to_json, headers: headers
    }
    it "does not add existing tag" do
      expect(response).to have_http_status(200)
      expect(json).not_to be_empty
      expect(json["name"]).to eq("test")
      expect(Tag.where(project_id: project.id).count).to eq(4)
    end
  end
  describe "POST /api/v1/projects/:project_id/tags repeated tags" do
    before {
      post "/api/v1/projects/#{project.id}/tags", params: { name: "test1" }.to_json, headers: headers
      post "/api/v1/projects/#{project.id}/tags", params: { name: "test1" }.to_json, headers: headers
    }
    it "allows duplicate" do
      expect(response).to have_http_status(200)
      expect(Tag.where(project_id: project.id).count).to eq(1)
    end
  end
  describe "GET /api/v1/tags/:ids" do
    context "user" do
      before {
        @tag1 = create(:tag, name: "test3", project: project)
        @tag2 = create(:tag, name: "test4", project: admin_project)
      }
      it "can find own tag" do
        get "/api/v1/tags/#{@tag1.id}", headers: headers
        expect(response).to have_http_status(200)
        expect(json).not_to be_empty
        expect(json["name"]).to eq("test3")
      end
      it "doesn't get other's tag" do
        get "/api/v1/tags/#{@tag2.id}", headers: headers
        expect(response).to have_http_status(401)
        expect(json["message"]).to eq("Unauthorized request")
      end
    end
  end
  describe "PUT /api/v1/tags/:id" do
    context "user" do
      before {
        @tag1 = create(:tag, name: "test3", project: project)
        @tag2 = create(:tag, name: "test4", project: admin_project)
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
      before {
        task = create(:task, project: project, tags_count: 3)
        # @tag1 = task.tags.first
      }
      it "can delete tags and TaskTags for todo_list" do
        @tag = Tag.where(project_id: project.id).first
        expect(TaskTag.where(tag_id: @tag.id).count).to eq(1)
        delete "/api/v1/tags/#{@tag.id}", headers: headers
        expect(response).to have_http_status(204)
        expect(TaskTag.where(tag_id: @tag.id).count).to eq(0)
      end
      it "user cannot delete others" do
        @tag = Tag.where(project_id: project.id).first
        expect(TaskTag.where(tag_id: @tag.id).count).to eq(1)
        delete "/api/v1/tags/#{@tag.id}", headers: admin_headers
        expect(response).to have_http_status(401)
        expect(TaskTag.where(tag_id: @tag.id).count).to eq(1)
      end
    end
  end
end
