class Api::V1::UsersController < ApplicationController
  skip_before_action :authorize_request, only: :create

  # GET /api/v1/users
  def index
    @users = User.where(nil)
    @users = @users.filter_by_id(params[:id]) if params[:id].present?
    json_response(@users)
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
    params.permit(:email, :name, :password, :verified)
  end
end
