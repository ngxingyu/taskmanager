class Api::V1::UsersController < ApplicationController
    # GET /api/v1/users
    def index
      @users = User.where(nil)
      @users = @users.filter_by_id(params[:id]) if params[:id].present?
      json_response(@users)
    end
  
    # POST /api/v1/users
    def create
      json_response(User.create!(user_params))
    end
  
    # GET /api/v1/users/:id
    def show
      json_response(User.find(params[:id]))
    end
  
    # PUT /api/v1/users/:id
    def update
      @user.update(user_params)
      head :no_content
    end
  
    # DELETE /api/v1/users/:id
    def destroy
      @user.destroy
      head :no_content
    end
  
    private
  
    def user_params
      # whitelist params
      params.permit(:email, :name, :verified)
    end
  end
  