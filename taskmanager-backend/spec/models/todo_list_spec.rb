require "rails_helper"

RSpec.describe TodoList, type: :model do
  it { should belong_to(:user) }
  it { should have_many(:todo_items) }
end
