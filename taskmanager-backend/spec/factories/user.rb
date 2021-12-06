FactoryBot.define do
  factory :project do
    name { Faker::Animal.name }
    transient do
      users { nil }
      role_id { 0 }
    end
    after(:create) do |project, evaluator|
      evaluator.users.each do |user|
        ProjectUserRole.create(user_id: user.id, project_id: project.id, role_id: evaluator.role_id)
      end
    end
  end
  factory :user do
    transient do
      projects_count { 0 }
      tasks_count { 0 }
      tags_count { 0 }
    end
    email { Faker::Internet.email }
    name { Faker::Name.name }
    password { Faker::Internet.password }
    after(:create) do |user, evaluator|
      projects = create_list(:project, evaluator.projects_count, users: [user])
      projects.each do |project|
        create_list(:tasks, evaluator.tasks_count, project: project, tags_count: evaluator.tags_count)
      end
    end
  end

  factory :tag do
    sequence(:name) { |n| "#{Faker::Company.name} #{n}" }
    project
    to_create do |instance|
      instance.id = Tag.find_or_create_by(name: instance.name, project: instance.project).id
      instance.reload
    end
  end
  factory :tasks do
    title { Faker::Team.state }
    description { Faker::Lorem.paragraph }
    transient do
      project
      tags_count { 0 }
    end
    after(:create) do |task, evaluator|
      (0...evaluator.tags_count).each do |i|
        tag = create(:tag, project: evaluator.project)
        create(:task_tag, task: task, tag: tag)
      end
    end
  end
  factory :task_tag do
    task
    tag
  end
end
