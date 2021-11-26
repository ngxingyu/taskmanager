require 'rails_helper'

RSpec.describe Tag, type: :model do
  it { should belong_to(:user) }
end
