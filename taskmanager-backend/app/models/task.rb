class Task < ApplicationRecord
  belongs_to :project, :foreign_key => :project_id
  belongs_to :parent, :class_name => "Task", optional: true
  has_many :children, :class_name => "Task", :foreign_key => :parent_id, dependent: :destroy
  has_many :task_tags
  has_many :tags, through: :task_tags
  SUPPORTED_FILTERS = [:all_tags, :title]
  scope :all_tags, ->(value) { where(:tags => value) }
  scope :title, ->(value) { where(title: "%#{value}%") }

  def all_tags=(names)
    names.each do |name|
      tag = Tag.create_or_find_by(project: project, name: name.strip)
      self.tags << tag
    end
  end

  def all_tags
    self.tags.map(&:name)
  end

  def to_h
    attributes.merge("all_tags" => all_tags)
  end

  def self.filter(attributes)
    attributes.permit(SUPPORTED_FILTERS).to_hash.reduce(all) do |scope, (key, value)|
      value.present? ? scope.send(key, value) : scope
    end
  end
  def self.search(pattern)
    if pattern.blank? # blank? covers both nil and empty string
      all
    else
      where("notes LIKE ?", "%#{pattern}%").or(where("title LIKE ?", "%#{pattern}%"))
    end
  end
  # scope :filter_by_user, -> (user_id) { where user_id: user_id }
end
