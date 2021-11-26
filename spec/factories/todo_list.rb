FactoryBot.define do
    factory :todo_list do
      title { Faker::Team.state }
      description { Faker::Lorem.paragraph }
      tag { create_list(:tag, 3) }
    end
  end