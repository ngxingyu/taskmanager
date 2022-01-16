class Api::V1::TagsController < ApplicationController
  # GET /api/v1/projects/#{project.id}/tags
  def index
    check_permission(params[:project_id], lambda {
      @tags = Tag.where(project_id: params[:project_id])
      json_response(@tags)
    })
  end

  # POST /api/v1/projects/#{project.id}/tags
  def create
    check_permission(params[:project_id], lambda {
      json_response(Tag.find_or_create_by(tag_params))
    })
  end

  # GET /api/v1/tags/:id
  def show
    @tag = Tag.find(params[:id])
    check_permission(@tag.project_id, lambda {
      json_response(@tag)
    })
  end

  # PUT /api/v1/tags/:id
  def update
    @tag = Tag.find(params[:id])
    check_permission(@tag.project_id, lambda {
      @tag.update(tag_params)
      head :no_content
    })
  end

  # DELETE /api/v1/tags/:id
  def destroy
    @tag = Tag.find(params[:id])
    check_permission(@tag.project_id, lambda {
      @tag.destroy
      head :no_content
    })
  end

  private

  def tag_params
    # whitelist params
    params.require(:tag).permit(:name).merge({ project_id: params[:project_id] })
  end

  def check_permission(project_id, fn)
    # user is member of project
    if (Project.exists?(id: project_id) &&
        !ProjectUserRole.where(project_id: project_id, user_id: current_user.id).empty?)
      fn.call
    else
      raise(
        ExceptionHandler::AuthenticationError,
        ("#{Message.unauthorized}")
      )
    end
  end
end
