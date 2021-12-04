class Api::V1::TodoItemsController < ApplicationController
  # GET /api/v1/todo_items
  def index
    @todo_items = TodoItem.all
    if params[:user_id].present?
      if (current_user.admin || params[:user_id].to_i == current_user.id)
        @todo_items = @todo_items.where(user_id: params[:user_id])
        json_response(@todo_items)
      else
        json_response({ message: "Permission denied" }, :unauthorized)
      end
    else
      @todo_items = @todo_items.where(user_id: current_user.id)
      json_response(@todo_items)
    end
  end

  # POST /api/v1/todo_items
  def create
    json_response(TodoItem.create!(todo_item_params))
  end

  # GET /api/v1/todo_items/:id
  def show
    json_response(TodoItem.find_by(id: params[:id], user_id: current_user.id))
  end

  # PUT /api/v1/todo_items/:id
  def update
    check_permission(lambda {
      @todo_item = TodoItem.where(id: params[:id], user_id: current_user.id)
      @todo_item.update(todo_item_params)
      head :no_content
    })
  end

  # DELETE /api/v1/todo_items/:id
  def destroy
    check_permission(lambda {
      @todo_item = TodoItem.find_by(id: params[:id], user_id: current_user.id)
      @todo_item.destroy
      head :no_content
    })
  end

  private

  def todo_item_params
    params.permit(:title, :description, :start_at, :duration, :notes, :importance, :todo_list_id).merge(user_id: current_user.id)
  end

  def check_permission(fn)
    # proceed if admin or user owns the todo item
    if (current_user.admin || TodoItem.find_by(id: params[:id]).user_id == current_user.id)
      fn.call
    else
      json_response({ message: "Permission denied" }, :unauthorized)
    end
  end
end
