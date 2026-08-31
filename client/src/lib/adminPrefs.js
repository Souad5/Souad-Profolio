export const ADMIN_ROOT_ATTRS = {
  theme: "data-admin-theme",
  fontScale: "data-admin-font-scale",
};

export function resolveTheme(theme) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

// Mirror of preferences shared between the FOUC-prevention inline script
// (index.html) and the runtime provider so they never diverge.
export function applyAdminPreferences(root, prefs) {
  const rootEl = root || document.documentElement;
  rootEl.setAttribute(ADMIN_ROOT_ATTRS.theme, resolveTheme(prefs.theme));
  rootEl.setAttribute(ADMIN_ROOT_ATTRS.fontScale, prefs.fontScale || "md");
  rootEl.classList.toggle("dark", resolveTheme(prefs.theme) === "dark");
}
