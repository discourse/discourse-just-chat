# frozen_string_literal: true

# name: discourse-just-chat
# about:  Hides everything that isn't chat
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
  SiteSetting.discourse_narrative_bot_enabled = false
  SiteSetting.chat_enabled = true
  SiteSetting.login_required = true
  SiteSetting.personal_message_enabled_groups = "1|2"
  SiteSetting.desktop_category_page_style = "categories_only"
  SiteSetting.mobile_category_page_style = "categories_only"
  SiteSetting.enable_badges = false
  DiscourseEvent.on(:user_created) do |user|
    user_option = user.user_option
    if user_option
      user_option.update_column(:chat_separate_sidebar_mode, UserOption.chat_separate_sidebar_modes[:always])
    end
  end
end
