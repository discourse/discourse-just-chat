# frozen_string_literal: true

module ::JustChatModule
  class Engine < ::Rails::Engine
    engine_name JUST_CHAT
    isolate_namespace JustChatModule
    config.autoload_paths << File.join(config.root, "lib")
  end
end
