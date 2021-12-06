require "rails_helper"

RSpec.describe Task, type: :model do
  it { should belong_to(:project) }
  it { should belong_to(:parent).optional }
  it { should have_many(:children) }
  it { should have_many(:task_tags) }
  it { should have_many(:tags) }
end
