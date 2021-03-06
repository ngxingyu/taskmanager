require "rails_helper"

RSpec.describe User, type: :model do
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:email) }
  it { should_not allow_values("", "a@b@c@d", "@.").for(:email) }
  it { should have_many(:projects) }
end
