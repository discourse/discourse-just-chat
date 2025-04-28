# frozen_string_literal: true

# name: discourse-just-chat
# about: Hides everything that isn't chat
# version: 0.0.1
# authors: Blake Erickson
# url: https://github.com/discourse/discourse-just-chat
# required_version: 2.8.0
# depends_on: chat

enabled_site_setting :just_chat_enabled

register_asset "stylesheets/just-chat.scss"

module ::JustChatModule
  JUST_CHAT = "discourse-just-chat"
end

require_relative "lib/just_chat_module/engine"

after_initialize do
  DiscourseEvent.on(:user_created) do |user|
    user_option = user.user_option
    if user_option
      user_option.update_column(:chat_separate_sidebar_mode, UserOption.chat_separate_sidebar_modes[:always])
    end
  end
end
