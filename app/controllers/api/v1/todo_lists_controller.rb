class Api::V1::TodoListsController < ApplicationController
  # GET /api/v1/todo_lists
  def index
    @todo_lists = TodoList.all
    json_response(@todo_lists)
  end

  # POST /api/v1/todo_lists
  def create
    json_response(TodoList.create!(todo_list_params))
  end

  # GET /api/v1/todo_lists/:id
  def show
    json_response(TodoList.find(params[:id]))
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
    params.permit(:title, :description, :created_by, :tags)
  end

  def set_todo
    @todo_list = TodoList.find(params[:id])
  end
end
