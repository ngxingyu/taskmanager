class Api::V1::TodoListsController < ApplicationController
  # GET /api/v1/todo_lists
  def index
    @todo_lists = TodoList.all
    @todo_lists = @todo_lists.where(user: current_user)
    json_response(@todo_lists)
  end

  # POST /api/v1/todo_lists
  def create
    todos = TodoList.create!(todo_list_params)
    json_response(todos)
  end

  # GET /api/v1/todo_lists/:id
  def show
    json_response(TodoList.where(user: current_user).find(params[:id]))
  end

  # PUT /api/v1/todo_lists/:id
  def update
    @todo_list.update(todo_list_params)
    head :no_content
  end

  # DELETE /api/v1/todo_lists/:id
  def destroy
    @todo_list.destroy
    head :no_content
  end

  private

  def todo_list_params
    # whitelist params
    params.require(:todo_list)
      .permit(:title, :description)
      .reverse_merge(user_id: current_user.id, all_tags: params[:all_tags])
  end

  def set_todo
    @todo_list = TodoList.find(params[:id])
  end
end
