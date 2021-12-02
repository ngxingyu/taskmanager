class TodoList < ApplicationRecord
  belongs_to :user
  has_many :todo_items
  has_many :taggings
  has_many :tags, through: :taggings

  # after_create :create_taggings

  def all_tags=(names)
    names.split(",").each do |name|
      self.tags << Tag.find_or_create_by(user: user, name: name.strip)
    end
  end

  def all_tags
    self.tags.map(&:name).join(", ")
  end

  def create_taggings
    Tagging.where(todo_list_id: self.id).destroy_all
    self.taggings = self.tags.map do |tag|
      Tagging.create(todo_list_id: self.id,
                     tag_id: tag.id)
    end
  end
end
