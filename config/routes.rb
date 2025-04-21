# frozen_string_literal: true

JustChatModule::Engine.routes.draw do
  #get "/examples" => "examples#index"
end

# Mount the engine as before
Discourse::Application.routes.draw do
  mount ::JustChatModule::Engine, at: "discourse-just-chat"
  # Redirect root to /chat for all users
  root to: redirect('/chat')
end
