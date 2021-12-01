class Api::V1::TodoItemsController < ApplicationController
  # GET /api/v1/todo_items
  def index
    @todo_items = TodoItem.where(nil)
    @todo_items = @todo_items.filter_by_user(params[:user_id]) if params[:user_id].present?
    json_response(@todo_items)
  end

  # POST /api/v1/todo_items
  def create
    json_response(TodoItem.create!(todo_item_params))
  end

  # GET /api/v1/todo_items/:id
  def show
    json_response(TodoItem.find(params[:id]))
  end

  # PUT /api/v1/todo_items/:id
  def update
    @todo_item.update(todo_item_params)
    head :no_content
  end

  # DELETE /api/v1/todo_items/:id
  def destroy
    @todo_item.destroy
    head :no_content
  end

  private

  def todo_item_params
    params.permit(:title, :description, :created_by, :tags)
  end
end
