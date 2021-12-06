class Task < ApplicationRecord
  belongs_to :project
  belongs_to :parent, :class_name => "Task", optional: true, inverse_of: :children
  has_many :children, :class_name => "Task", :foreign_key => { to_table: :tasks }, inverse_of: :parent
  has_many :task_tags, dependent: :destroy
  has_many :tags, through: :task_tags
  attr_accessor :all_tags

  def all_tags=(names)
    names.each do |name|
      self.tags << Tag.find_or_create_by!(project: project, name: name.strip)
    end
  end

  def all_tags
    self.tags.map(&:name)
  end

  def to_h
    attributes.merge("all_tags" => all_tags)
  end

  # scope :filter_by_user, -> (user_id) { where user_id: user_id }
end
