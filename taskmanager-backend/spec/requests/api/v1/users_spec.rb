require "rails_helper"

RSpec.describe "Api::V1::Users", type: :request do
  let!(:user) { create(:user, password: "password") }
  let(:headers) { valid_headers }
  let(:valid_attributes) do
    attributes_for(:user, password: user.password, password_confirmation: user.password)
  end

  # User signup test suite
  describe "POST /signup" do
    context "when valid request" do
      before {
        post "/signup", params: valid_attributes.to_json, headers: headers
        @current_user = User.last
      }

      it "creates a new user" do
        expect(response).to have_http_status(201)
      end

      it "returns success message" do
        expect(json["message"]).to match(/Account created successfully/)
      end

      it "returns an authentication token" do
        expect(json["auth_token"]).not_to be_nil
      end

      it "expects the default My Tasks project to be created" do
        projects = ProjectUserRole.where(user_id: @current_user.id)
        expect(projects.count).to eq(1)
        expect(Project.find(projects.first.project_id).name).to eq("My Tasks")
      end
    end

    context "when invalid request" do
      before {
        @old_projects_count = Project.all.count
        post "/signup", params: {}, headers: headers }

      it "does not create a new user" do
        expect(response).to have_http_status(422)
      end

      it "returns failure message" do
        expect(json["message"]).to match("Validation failed: Password can't be blank, Name can't be blank, Email can't be blank, Email is too short (minimum is 5 characters), Email Invalid email, Password digest can't be blank")
      end

      it "doesn't change the project count" do
        expect(Project.all.count).to eq(@old_projects_count)
      end
    end
    context "when wrong confirmation password" do
      before {
        post "/signup", params: attributes_for(:user, password: "a", password_confirmation: "b").to_json,
                        headers: headers
      }

      it "does not succeed, throws error message" do
        expect(response).to have_http_status(422)
        expect(json["message"]).to match(Message.invalid_confirmation_password)
      end

      it "returns an authentication token" do
        expect(json["auth_token"]).to be_nil
      end
    end
  end

  describe "GET /api/v1/users (for admin)" do
    context "admin user" do
      before {
        expect(User.all.count).to eq(1)
        @admin = create(:user, admin: true)
        @admin_headers = valid_headers(@admin)
        get "/api/v1/users", headers: @admin_headers
      }
      it "returns lists" do
        expect(json).not_to be_empty
        expect(json.size).to eq(2)
      end
      it "returns status code 200" do
        expect(response).to have_http_status(200)
      end
    end
    context "non-admin user" do
      before(:each) { get "/api/v1/users", headers: headers }
      it "returns status code 401" do
        expect(response).to have_http_status(401)
      end
      it "returns lists" do
        expect(json["message"]).to eq(Message.unauthorized)
      end
    end
  end

  describe "GET /api/v1/users (for admin)" do
    context "admin user" do
      before {
        expect(User.all.count).to eq(1)
        @admin = create(:user, admin: true)
        @admin_headers = valid_headers(@admin)
        get "/api/v1/users", headers: @admin_headers
      }
      it "returns lists" do
        expect(json).not_to be_empty
        expect(json.size).to eq(2)
      end
      it "returns status code 200" do
        expect(response).to have_http_status(200)
      end
    end
    context "non-admin user" do
      before(:each) { get "/api/v1/users", headers: headers }
      it "returns status code 401" do
        expect(response).to have_http_status(401)
      end
      it "returns lists" do
        expect(json["message"]).to eq(Message.unauthorized)
      end
    end
  end

  describe "GET /profile" do
    context "admin user" do
      before {
        expect(User.all.count).to eq(1)
        @admin = create(:user, admin: true)
        @admin_headers = valid_headers(@admin)
        get "/profile", headers: @admin_headers
      }
      it "returns lists" do
        expect(json).not_to be_empty
        expect(json["id"]).to eq(@admin.id)
      end
      it "returns status code 200" do
        expect(response).to have_http_status(200)
      end
    end
    context "non-admin user" do
      before(:each) { get "/profile", headers: headers }
      it "returns lists" do
        expect(json).not_to be_empty
        expect(json["id"]).to eq(user.id)
      end
      it "returns status code 200" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "GET /api/v1/users/:id" do
    context "admin user" do
      before {
        expect(User.all.count).to eq(1)
        @admin = create(:user, admin: true)
        @admin_headers = valid_headers(@admin)
        get "/api/v1/users/#{user.id}", headers: @admin_headers
      }
      it "returns lists" do
        expect(json).not_to be_empty
        expect(json["id"]).to eq(user.id)
      end
      it "returns status code 200" do
        expect(response).to have_http_status(200)
      end
    end
    context "non-admin user" do
      before {
        @admin = create(:user, admin: true)
        get "/api/v1/users/#{@admin.id}", headers: headers
      }
      it "returns status code 401" do
        expect(response).to have_http_status(401)
      end
    end
  end

  describe "PUT /api/v1/users/:id" do
    context "admin user" do
      before(:each) {
        @user1 = create(:user, email: "user@user.user", name: "user", password: "password")
        @admin = create(:user, email: "admin@admin.admin", admin: true, name: "admin", password: "admin")
        @header1 = valid_headers(@user1)
        @headeradmin = valid_headers(@admin)
      }
      it "current user modify current user" do
        params = { email: "User1@user.user", name: "user1" }
        put "/api/v1/users/#{@user1[:id]}", params: params.to_json, headers: @header1
        expect(response).to have_http_status(204)
        expect(User.find_by(id: @user1.id).email).to eq("user1@user.user")
        expect(User.find_by(id: @user1.id).name).to eq("user1")
      end
      it "admin modify current user" do
        params = { email: "useR1@user.user", name: "user1" }
        put "/api/v1/users/#{@user1[:id]}", params: params.to_json, headers: @headeradmin
        expect(response).to have_http_status(204)
        expect(User.find_by(id: @user1.id).email).to eq("user1@user.user")
        expect(User.find_by(id: @user1.id).name).to eq("user1")
      end
      it "non admin modify another user" do
        params = { email: "user1@uSer.user", name: "user1" }
        put "/api/v1/users/#{@admin[:id]}", params: params.to_json, headers: @header1
        expect(response).to have_http_status(401)
        expect(User.find_by(id: @admin.id).email).to eq("admin@admin.admin")
        expect(User.find_by(id: @admin.id).name).to eq("admin")
      end
    end
  end
  describe "DELETE /api/v1/users/:id" do
    context "admin user" do
      before(:each) {
        @user1 = create(:user, email: "user@user.user", name: "user", password: "password")
        @admin = create(:user, email: "admin@admin.admin", admin: true, name: "admin", password: "admin")
        expect(ProjectUserRole.where(user:@user1).count).to eq(1)
        @header1 = valid_headers(@user1)
        @headeradmin = valid_headers(@admin)
      }
      it "current user modify current user" do
        params = { password: "wrong" }
        delete "/api/v1/users/#{@user1[:id]}", params: params.to_json, headers: @header1
        expect(response).to have_http_status(401)
        params = { password: "password" }
        delete "/api/v1/users/#{@user1[:id]}", params: params.to_json, headers: @header1
        expect(response).to have_http_status(204)
        expect(User.where(id: @user1.id).count).to eq(0)
        expect(ProjectUserRole.where(user:@user1).count).to eq(0)
      end
      it "admin modify current user" do
        params = { password: "password" }
        delete "/api/v1/users/#{@user1[:id]}", params: params.to_json, headers: @headeradmin
        expect(response).to have_http_status(204)
        expect(User.where(id: @user1.id).count).to eq(0)
      end
      it "non admin modify another user" do
        params = { password: "password" }
        delete "/api/v1/users/#{@admin[:id]}", params: params.to_json, headers: @header1
        expect(response).to have_http_status(401)
        expect(User.where(id: @user1.id).count).to eq(1)
      end
    end
  end
end
