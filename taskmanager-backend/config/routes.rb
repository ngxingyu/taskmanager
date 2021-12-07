Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :projects, shallow: true do
        resources  :tags, :tasks
      end
       resources :users
    end
  end
  post "login", to: "authentication#authenticate"
  post "signup", to: "api/v1/users#create"
  get "profile", to: "api/v1/users#profile"
end
