import { withPluginApi } from "discourse/lib/plugin-api";

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
            transition.targetName === "discovery.index" &&
            (!transition.from || transition.from === null)
          ) {
            const router = api.container.lookup("service:router");
            router.replaceWith("/chat");
          } else if (this._super) {
            return this._super(...arguments);
          }
        },
      });

      function redirectToChatAndSidebar(router) {
        router.replaceWith("/chat");
        const sidebarState = api.container.lookup("service:sidebar-state");
        sidebarState?.setPanel("chat");
      }

      // Block user drafts route in Ember
      api.modifyClass("route:user-activity-drafts", {
        beforeModel() {
          redirectToChatAndSidebar(this.router);
        },
      });

      // Block user activity route in Ember
      api.modifyClass("route:user-activity", {
        beforeModel() {
          redirectToChatAndSidebar(this.router);
        },
      });

      // Force chat sidebar on preferences/account route
      api.onPageChange(() => {
        const router = api.container.lookup("service:router");
        if (router.currentRouteName === "user.preferences.account") {
          const sidebarState = api.container.lookup("service:sidebar-state");
          sidebarState?.setPanel("chat");
        }
      });

      // Redirect /categories to /chat for non-admins
      api.onPageChange(() => {
        const router = api.container.lookup("service:router");
        if (
          router.currentRouteName === "discovery.categories" &&
          !api.getCurrentUser()?.admin
        ) {
          router.replaceWith("/chat");
        }
        // Always force chat sidebar on /categories
        if (router.currentRouteName === "discovery.categories") {
          const sidebarState = api.container.lookup("service:sidebar-state");
          sidebarState?.setPanel("chat");
        }

        // Force chat sidebar on category edit pages
        if (router.currentRouteName === "editCategory.tabs") {
          const sidebarState = api.container.lookup("service:sidebar-state");
          sidebarState?.setPanel("chat");
        }
      });

      // Redirect all common list/user activity routes to /chat
      ["latest", "new", "top", "hot", "unread", "unseen"].forEach((filter) => {
        api.modifyClass(`route:discovery/${filter}`, {
          beforeModel(transition) {
            if (
              transition.targetName === `discovery.${filter}` &&
              (!transition.from || transition.from === null)
            ) {
              const router = api.container.lookup("service:router");
              router.replaceWith("/chat");
            } else if (this._super) {
              return this._super(...arguments);
            }
          },
        });
      });

      // Intercept category link clicks
      api.onPageChange(() => {
        // Handle category list links
        document.querySelectorAll(".category-title-link").forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            if (href) {
              const router = api.container.lookup("service:router");
              // Extract the category path from the href, ignoring IDs
              const match = href.match(/\/c\/([^\/]+(?:\/[^\/]+)?)(?:\/\d+)?$/);
              if (match) {
                // Remove any trailing ID from the category path
                const categoryPath = match[1].replace(/\/\d+$/, "");
                // Check if it's a subcategory
                const parts = categoryPath.split("/");
                if (parts.length > 1) {
                  // It's a subcategory, use original parent category
                  const targetUrl = `/c/${parts[0]}/${parts[1]}/edit/`;
                  const sidebarState = api.container.lookup(
                    "service:sidebar-state"
                  );
                  if (
                    sidebarState &&
                    typeof sidebarState.setPanel === "function"
                  ) {
                    sidebarState.setPanel("chat");
                  }
                  router.replaceWith(targetUrl);
                } else {
                  // It's a parent category
                  const targetUrl = `/c/${categoryPath}/edit/`;
                  const sidebarState = api.container.lookup(
                    "service:sidebar-state"
                  );
                  if (
                    sidebarState &&
                    typeof sidebarState.setPanel === "function"
                  ) {
                    sidebarState.setPanel("chat");
                  }
                  router.replaceWith(targetUrl);
                }
              }
            }
          });
        });

        // Handle chat interface category links
        document
          .querySelectorAll(".badge-category__wrapper")
          .forEach((link) => {
            link.addEventListener("click", (e) => {
              e.preventDefault();
              const href = link.getAttribute("href");
              if (href) {
                const router = api.container.lookup("service:router");
                // Extract the category path from the href, ignoring IDs
                const match = href.match(
                  /\/c\/([^\/]+(?:\/[^\/]+)?)(?:\/\d+)?$/
                );
                if (match) {
                  // Remove any trailing ID from the category path
                  const categoryPath = match[1].replace(/\/\d+$/, "");
                  // Check if it's a subcategory
                  const parts = categoryPath.split("/");
                  if (parts.length > 1) {
                    // It's a subcategory, use original parent category
                    const targetUrl = `/c/${parts[0]}/${parts[1]}/edit/`;
                    const sidebarState = api.container.lookup(
                      "service:sidebar-state"
                    );
                    if (
                      sidebarState &&
                      typeof sidebarState.setPanel === "function"
                    ) {
                      sidebarState.setPanel("chat");
                    }
                    router.replaceWith(targetUrl);
                  } else {
                    // It's a parent category
                    const targetUrl = `/c/${categoryPath}/edit/`;
                    const sidebarState = api.container.lookup(
                      "service:sidebar-state"
                    );
                    if (
                      sidebarState &&
                      typeof sidebarState.setPanel === "function"
                    ) {
                      sidebarState.setPanel("chat");
                    }
                    router.replaceWith(targetUrl);
                  }
                }
              }
            });
          });
      });
    });
  },
};
