class Api::V1::ProjectsController < ApplicationController
  # GET /api/v1/projects
  def index
    @projects = current_user.projects
    json_response(@projects.map { |t| t.to_h })
  end

  # POST /api/v1/projects
  def create
    project = current_user.create_project(params[:name])
    params[:permissions].each do |u|
      user = User.find_by(email: u[:email])
      ProjectUserRole.find_or_create_by(user:user, project:project, role_id: u[:role])
    end
    json_response(project.to_h)
  end

  # GET /api/v1/todo_lists/:id
  def show
    json_response(TodoList.where(user: current_user).find(params[:id]).to_h)
  end

  # PUT /api/v1/todo_lists/:id
  def update
    @todo_list = TodoList.where(user: current_user).find(params[:id])
    if params.key?(:all_tags)
      @todo_list.tags.delete_all
    end
    @todo_list.update(todo_list_params)
    head :no_content
  end

  # DELETE /api/v1/todo_lists/:id
  def destroy
    @todo_list = TodoList.where(user: current_user).find(params[:id])
    @todo_list.tags.delete_all
    @todo_list.destroy
    head :no_content
  end

  private

  def todo_list_params
    # whitelist params
    params
    # .require(:todo_list)
      .permit(:title, :description)
      .reverse_merge(user_id: current_user.id, all_tags: params[:all_tags]).reject { |k, v| v.nil? }
  end
end
