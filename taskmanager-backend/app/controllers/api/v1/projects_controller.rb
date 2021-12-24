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
      ProjectUserRole.find_or_create_by(user_id: u[:user_id], project: project, role_id: u[:role_id])
    end
    json_response(project.to_h)
  end

  # GET /api/v1/projects/:id?depth=...&parent_id=...
  # if depth empty or negative: will not return any tasks. else
  # if parent_id empty, default to nil,
  def show
    check_permission(lambda {
      res = current_user.projects.find(params[:id]).to_h(depth: [Integer(params[:depth] || 0), 0].max,
                                                         parent_id: params.key?(:parent_id) ? Integer(params[:parent_id]) : nil)
      json_response(res)
    })
  end

  # PUT /api/v1/projects/:id
  def update
    check_permission(lambda {
      params = project_params
      @project = Project.find(params[:id])
      if get_user_role(@project.id) == 0
        @project.update(name: params[:name]) unless !params.key?(:name)
      end

      ProjectUserRole.upsert_all(params[:permissions],
                                 unique_by: :index_project_user_roles_on_project_id_and_user_id) unless params[:permissions].empty?

      head :no_content
    })
  end

  # DELETE /api/v1/projects/:id
  # TODO: only owners can delete board
  # Ensure all ProjectUserRoles are deleted
  # Ensure all tasks related to project are deleted.
  def destroy
    check_permission(lambda {
      if (get_user_role(params[:id])) == 0
        @project = Project.find(params[:id])
        @project.tasks.destroy_all
        @project.tags.destroy_all
        ProjectUserRole.where(project_id: @project.id).destroy_all
        @project.destroy
        head :no_content
      else
        raise(
          ExceptionHandler::AuthenticationError,
          ("#{Message.unauthorized}")
        )
      end
    })
  end

  private

  def get_user_role(pid)
    current_user.project_user_roles.find_by(project_id: pid).role_id
  end

  def project_params
    # whitelist params
    hash = Hash.new
    new_owner_count = 0
    (params[:permissions] || []).each do |p|
      tmp = User.where(email: p[:email])
      if tmp.count != 0
        hash[tmp.first.id] = p[:role]
      end
      if p[:role] == 0
        new_owner_count += 1
      end
    end
    permissions = Array.new
    if Project.exists?(params[:id])
      project = Project.find(params[:id])
      user_role = get_user_role(project.id)
      if user_role > 0
        ## User can only demote himself.
        permissions << { user_id: current_user.id, project_id: project.id, role_id: [user_role, hash[current_user.id]].max, created_at: Time.now, updated_at: Time.now }
      elsif hash.key?(current_user.id) && hash[current_user.id] > 0 && new_owner_count == 0
        ## User tries to demote himself with no replacement owner
        hash[current_user.id] = 0
        hash.map { |uid, rid|
          permissions << { user_id: uid, project_id: project.id, role_id: rid, created_at: Time.now, updated_at: Time.now }
        }
      else
        ## User doesn't demote himself
        hash.map { |uid, rid|
          permissions << { user_id: uid, project_id: project.id, role_id: rid, created_at: Time.now, updated_at: Time.now }
        }
      end
    else
      hash[current_user.id] = 0

      hash.map { |uid, rid|
        permissions << { user_id: uid, role_id: rid, created_at: Time.now, updated_at: Time.now }
      }
    end
    params
    # .require(:project)
      .permit(:name)
      .merge(permissions: permissions, id: params[:id])
      .reject { |k, v| v.nil? }
  end

  def check_permission(fn)
    # user is member of project
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
