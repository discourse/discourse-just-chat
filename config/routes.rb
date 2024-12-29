# frozen_string_literal: true

JustChatModule::Engine.routes.draw do
  #get "/examples" => "examples#index"
end

Discourse::Application.routes.draw { mount ::JustChatModule::Engine, at: "just-chat" }
