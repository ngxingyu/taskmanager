class Api::V1::TagsController < ApplicationController
  # GET /api/v1/tags
  def index
    @tags = Tag.where(nil)
    @tags = @tags.filter_by_user(params[:user_id]) if params[:user_id].present?
    json_response(@tags)
  end

  # POST /api/v1/tags
  def create
    json_response(Tag.create!(tag_params))
  end

  # GET /api/v1/tags/:id
  def show
    json_response(Tag.find(params[:id]))
  end

  # PUT /api/v1/tags/:id
  def update
    @tag.update(tag_params)
    head :no_content
  end

  # DELETE /api/v1/tags/:id
  def destroy
    @tag.destroy
    head :no_content
  end

  private

  def tag_params
    # whitelist params
    params.permit(:user_id, :name)
  end
end
