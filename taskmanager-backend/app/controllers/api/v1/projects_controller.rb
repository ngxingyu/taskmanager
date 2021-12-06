class Api::V1::ProjectsController < ApplicationController
  # GET /api/v1/projects
  def index
    @projects = current_user.projects
    json_response(@projects.map { |t| t.to_h })
  end

  # POST /api/v1/projects
  def create
    params = project_params
    project = current_user.create_project(params[:name])
    params[:permissions].each do |u|
      ProjectUserRole.find_or_create_by(user: u[:user], project: project, role_id: u[:role_id])
    end
    json_response(project.to_h)
  end

  # GET /api/v1/projects/:id
  # TODO: perhaps take in parameter for parent task node
  def show
    check_permission(lambda {
      res = current_user.projects.find(params[:id]).to_h(depth: params[:depth].to_i || 0)
      json_response(res)
    })
  end

  # PUT /api/v1/projects/:id
  # TODO: only owners can elevate user permissions or add users
  # only owners and editors can modify project name
  def update
    @todo_list = TodoList.where(user: current_user).find(params[:id])
    if params.key?(:all_tags)
      @todo_list.tags.delete_all
    end
    @todo_list.update(todo_list_params)
    head :no_content
  end

  # DELETE /api/v1/projects/:id
  # TODO: only owners can delete board
  # Ensure all ProjectUserRoles are deleted
  # Ensure all tasks related to project are deleted.
  def destroy
    @todo_list = TodoList.where(user: current_user).find(params[:id])
    @todo_list.tags.delete_all
    @todo_list.destroy
    head :no_content
  end

  private

  def project_params
    # whitelist params
    params
      .require(:project)
      .permit(:name)
      .merge(permissions: params[:permissions]
               .map { |p|
               tmp = User.where(email: p[:email])
               { user: tmp.count == 0 ? nil : tmp.first, role_id: p[:role] }
             }.select { |p| !(p[:user].nil? || p[:user] == current_user) })
      .reject { |k, v| v.nil? }
  end

  def check_permission(fn)
    # proceed if admin or user owns the todo item
    if (Project.exists?(id: params[:id]) &&
        !ProjectUserRole.where(project_id: params[:id], user_id: current_user.id).empty?)
      fn.call
    else
      raise(
        ExceptionHandler::AuthenticationError,
        ("#{Message.unauthorized}")
      )
    end
  end
end
