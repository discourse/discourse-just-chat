import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "@ember/application";

export default {
  name: "just-chat-home-logo-href",

  initialize() {
    withPluginApi("1.2.0", (api) => {
      api.modifyClass("component:header/home-logo", {
        href: "/chat",
      });

      // Redirect root route to /chat
      api.modifyClass("route:discovery", {
        beforeModel(transition) {
          if (
            window.location.pathname === "/" &&
            (!transition.from || transition.from === null)
          ) {
            const router = getOwner(this).lookup("router:main");
            router.replaceWith("/chat");
          } else if (this._super) {
            return this._super(...arguments);
          }
        }
      });

      function redirectToChatAndSidebar(router) {
        router.replaceWith("/chat");
        const sidebarState =
          api.container.lookup("service:sidebar-state") ||
          api.container.lookup("service:sidebarState");
        if (sidebarState && typeof sidebarState.setPanel === "function") {
          sidebarState.setPanel("chat");
        }
      }

      // Block user drafts route in Ember
      api.modifyClass("route:user-activity-drafts", {
        beforeModel() {
          redirectToChatAndSidebar(this.router);
        }
      });

      // Block user activity route in Ember
      api.modifyClass("route:user-activity", {
        beforeModel() {
          redirectToChatAndSidebar(this.router);
        }
      });

      // Force chat sidebar on preferences/account route
      api.onPageChange(() => {
        if (window.location.pathname.match(/^\/u\/(.+?)\/preferences\/account/)) {
          const sidebarState =
            api.container.lookup("service:sidebar-state") ||
            api.container.lookup("service:sidebarState");
          if (sidebarState && typeof sidebarState.setPanel === "function") {
            sidebarState.setPanel("chat");
          }
        }
      });

      // Redirect /categories to /chat for non-admins
      api.onPageChange(() => {
        if (
          window.location.pathname === "/categories" &&
          !api.getCurrentUser()?.admin
        ) {
          const router = api.container.lookup("router:main");
          router.replaceWith("/chat");
        }
        // Always force chat sidebar on /categories
        if (window.location.pathname === "/categories") {
          const sidebarState =
            api.container.lookup("service:sidebar-state") ||
            api.container.lookup("service:sidebarState");
          if (sidebarState && typeof sidebarState.setPanel === "function") {
            sidebarState.setPanel("chat");
          }
        }
      });

      // Redirect all common list/user activity routes to /chat
      [
        "latest",
        "new",
        "top",
        "hot",
        "unread",
        "unseen",
      ].forEach((filter) => {
        api.modifyClass(`route:discovery/${filter}`, {
          beforeModel(transition) {
            if (
              window.location.pathname === `/${filter}` &&
              (!transition.from || transition.from === null)
            ) {
              const router = getOwner(this).lookup("router:main");
              router.replaceWith("/chat");
            } else if (this._super) {
              return this._super(...arguments);
            }
          }
        });
      });
    });
  },
};