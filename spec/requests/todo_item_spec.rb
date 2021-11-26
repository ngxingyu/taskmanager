require 'rails_helper'

RSpec.describe "TodoItems", type: :request do
  describe "GET /title:string" do
    it "returns http success" do
      get "/todo_item/title:string"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /description:string" do
    it "returns http success" do
      get "/todo_item/description:string"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /completed:boolean" do
    it "returns http success" do
      get "/todo_item/completed:boolean"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /start_at:datetime" do
    it "returns http success" do
      get "/todo_item/start_at:datetime"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /duration:time" do
    it "returns http success" do
      get "/todo_item/duration:time"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /importance:integer" do
    it "returns http success" do
      get "/todo_item/importance:integer"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /todo_list:references" do
    it "returns http success" do
      get "/todo_item/todo_list:references"
      expect(response).to have_http_status(:success)
    end
  end

end
