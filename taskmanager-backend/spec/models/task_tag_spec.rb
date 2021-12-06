require "rails_helper"

RSpec.describe TaskTag, type: :model do
  it { should belong_to(:tag) }
  it { should belong_to(:task) }
end
