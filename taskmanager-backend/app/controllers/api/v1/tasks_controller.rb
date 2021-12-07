class Api::V1::TasksController < ApplicationController
  # GET /api/v1/projects/:project_id/tasks?depth=???&parent_id=???
  def index
    check_permission(params[:project_id],lambda {
      parent_id = params.key?(:parent_id) ? Integer(params[:parent_id]) : nil
      parents = Task.where(id: parent_id)
      parent = (parent_id.nil? || parents.empty?) ? nil : parents.first
      @tasks = Project.find(params[:project_id]).get_tasks(parent: parent,
                                                           depth: [Integer(params[:depth] || 2), 0].max)
      json_response(@tasks.map { |t| t.to_h })
    })
  end

  # POST /api/v1/projects/:project_id/tasks
  def create
    check_permission(params[:project_id], lambda {
      todos = Task.create(task_params)
      json_response(todos.to_h)
    })
  end

  # GET /api/v1/tasks/:id
  def show
    @task = Task.find(params[:id])
    check_permission(@task.project_id, lambda {
      json_response(@task.to_h)
    })
  end

  # PUT /api/v1/tasks/:id
  def update
    @task = Task.find(params[:id])
    check_permission(@task.project_id, lambda {
      if params.key?(:all_tags)
        @task.tags.delete_all
      end
      @task.update(task_params)
      head :no_content
    })
  end

  # DELETE /api/v1/tasks/:id
  def destroy
    @task = Task.find(params[:id])
    check_permission(@task.project_id, lambda {
      @task.tags.delete_all
      @task.destroy
      head :no_content
    })
  end

  private

  def task_params
    # whitelist params
    params
    # .require(:task)
      .permit(:title, :notes, :start_at, :duration, :importance, :parent_id, :task_status_id)
      .reverse_merge(project_id: params[:project_id], all_tags: params[:all_tags]).reject { |k, v| v.nil? }
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
