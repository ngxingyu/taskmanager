class Api::V1::TagsController < ApplicationController
  # GET /api/v1/tags?user_id=??
  def index
    @tags = Tag.all
    if params[:user_id].present?
      check_permission(lambda {
        @tags = @tags.where(user_id: params[:user_id])
        json_response(@tags)
      })
    else
      @tags = @tags.where(user_id: current_user.id)
      json_response(@tags)
    end
  end

  # POST /api/v1/tags
  def create
    json_response(Tag.create(tag_params))
  end

  # GET /api/v1/tags/:id
  def show
    json_response(Tag.find_by(tag_params))
  end

  # PUT /api/v1/tags/:id
  def update
    Tag.where(user_id: current_user.id, id: params[:id])
      .update(tag_params)
    head :no_content
  end

  # DELETE /api/v1/tags/:id
  def destroy
    # @taggings = Tagging.where(params.permit(:tag_id))
    # @taggings.destroy
    @tag = Tag.where(user_id: current_user.id).find(params[:id])
    @tag.destroy
    head :no_content
  end

  private

  def tag_params
    # whitelist params
    params.permit(:tag, :id, :name).merge({ user_id: current_user.id })
  end

  def check_permission(fn)
    # proceed if admin or same user id as current_user
    if (current_user.admin || params[:user_id].to_i == current_user.id)
      fn.call
    else
      raise(
        ExceptionHandler::AuthenticationError,
        ("#{Message.unauthorized}")
      )
    end
  end
end
