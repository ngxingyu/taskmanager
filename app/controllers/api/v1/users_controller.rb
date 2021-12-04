class Api::V1::UsersController < ApplicationController
  skip_before_action :authorize_request, only: :create
  # GET /api/v1/users
  def index
    check_permission(lambda {
      @users = User.all
      json_response(@users)
    })
  end

  # GET /profile
  def profile
    json_response(current_user)
  end

  # POST /api/v1/users
  def create
    user = User.create!(user_params)
    auth_token = AuthenticateUser.new(user.email, user.password).call
    response = { message: Message.account_created, auth_token: auth_token }
    json_response(response, :created)
    # json_response(User.create!(user_params))
  end

  # GET /api/v1/users/:id
  def show
    check_permission(lambda {
      json_response(User.find(params[:id]))
    })
  end

  # PUT /api/v1/users/:id
  def update
    check_permission(lambda {
      @user = User.find(params[:id])
      @user.update(user_params)
      head :no_content
    })
  end

  # DELETE /api/v1/users/:id
  def destroy
    check_permission(lambda {
      @user = User.find(params[:id])
      @user.destroy
      head :no_content
    })
  end

  private

  def user_params
    # whitelist params
    params.permit(:email, :name, :password, :verified)
  end

  def check_permission(fn)
    # proceed if admin or same user id as current_user
    if (current_user.admin || params[:id].to_i == current_user.id)
      fn.call
    else
      json_response({ message: "Permission denied" }, :unauthorized)
    end
  end
end
