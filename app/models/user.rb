class User < ApplicationRecord
  has_secure_password
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, length: { minimum: 5, maximum: 250 },
                    uniqueness: { case_sensitive: false }, format: { with: /\A[^@\s]+@[^@\s]+\z/, message: "Invalid email" }
  scope :filter_by_id, ->(user_id) { where user_id: user_id }
end
