require "rails_helper"

RSpec.describe Project, type: :model do
  it { should have_many(:users) }
  it { should have_many(:project_user_roles) }
  it { should have_many(:tasks) }
  it { should have_many(:tags) }
end
