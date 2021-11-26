class TodoItemController < ApplicationController
  def title:string
  end

  def description:string
  end

  def completed:boolean
  end

  def start_at:datetime
  end

  def duration:time
  end

  def importance:integer
  end

  def todo_list:references
  end
end
