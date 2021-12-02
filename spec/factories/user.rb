FactoryBot.define do
  factory :user do
    transient do
      todo_lists_count { 2 }
      todo_items_count { 3 }
      tags_count { 2 }
    end
    email { Faker::Internet.email }
    name { Faker::Name.name }
    password { Faker::Internet.password }
    after(:create) do |user, evaluator|
      create_list(:todo_list, evaluator.todo_lists_count, user: user, tags_count: evaluator.tags_count) do |list|
        create_list(:todo_item, evaluator.todo_items_count, todo_list: list, user: user)
      end
    end
  end
  factory :tag do
    name { Faker::Creature::Animal.name }
    user
  end
  factory :todo_list do
    title { Faker::Team.state }
    description { Faker::Lorem.paragraph }
    transient do
      user
      tags_count { 5 }
    end
    after(:create) do |todo_list, evaluator|
      (0...evaluator.tags_count).each do |i|
        tag = create(:tag, user: evaluator.user)
        create(:tagging, todo_list: todo_list, tag: tag)
      end
    end
  end
  factory :tagging do
    todo_list
    tag
  end 
  factory :todo_item do
    association :user
    association :todo_list
    title { Faker::Team.state }
    description { Faker::Lorem.paragraph }
    completed { false }
  end
end

def create_users(users_count, todo_lists_count, todo_items_count)
  FactoryBot.create_list(:user, users_count, todo_lists_count: todo_lists_count, todo_items_count: todo_items_count)
end
