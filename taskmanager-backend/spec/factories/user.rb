FactoryBot.define do
  factory :project do
    name { Faker::Creature::Animal.name }
    transient do
      users { Array.new() }
      role_id { 0 }
    end
    after(:create) do |project, evaluator|
      evaluator.users.each do |user|
        ProjectUserRole.upsert_all([{ user_id: user.id, project_id: project.id, role_id: evaluator.role_id }],
                                   unique_by: :index_project_user_roles_on_project_id_and_user_id)
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
      create_list(:project, evaluator.projects_count, users: [user])
      user.projects.each do |project|
        create_list(:task, evaluator.tasks_count, project: project, tags_count: evaluator.tags_count)
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
  factory :task do
    title { Faker::Team.state }
    notes { Faker::Lorem.paragraph }
    parent { nil }
    transient do
      project
      subtasks { 0 }
      depth { 1 }
      tags_count { 0 }
    end
    after(:create) do |t, evaluator|
      (0...evaluator.tags_count).each do |i|
        tag = create(:tag, project: evaluator.project)
        create(:task_tag, task: t, tag: tag)
      end
      create_list(:task, evaluator.subtasks,
                  parent: t, project: evaluator.project, subtasks: evaluator.subtasks,
                  depth: evaluator.depth - 1, tags_count: evaluator.tags_count) unless evaluator.depth <= 1
    end
  end
  factory :task_tag do
    task
    tag
  end
end
