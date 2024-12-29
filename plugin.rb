# frozen_string_literal: true

# name: just-chat
# about:  Hides everything that isn't chat
# version: 0.0.1
# authors: Blake Erickson
# url: https://github.com/oblakeerickson/just-chat

enabled_site_setting :just_chat_enabled

module ::JustChatModule
  JUST_CHAT = "just-chat"
end

require_relative "lib/just_chat_module/engine"

after_initialize do
end
