require 'rails_helper'

RSpec.describe Tag, type: :model do
  it { should belong_to(:project) }
  it { should have_many(:task_tags) }
  it { should have_many(:tasks) }
end
