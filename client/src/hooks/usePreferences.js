import { createContext, createElement, useCallback, useContext, useMemo, useState } from "react";

// Namespaced storage key for all admin UI preferences. Deliberately separate
// from the public site's `portfolio_theme` so admin choices never bleed into
// the public-facing theme.
export const PREFERENCES_KEY = "admin:preferences";

export const THEME_OPTIONS = ["light", "dark", "system"];
export const FONT_SCALE_OPTIONS = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "X-Large" },
];

export const DEFAULT_PREFERENCES = {
  theme: "system", // light | dark | system
  fontScale: "md", // sm | md | lg | xl
  sidebarCollapsed: false,
  tableDensity: "comfortable", // comfortable | compact
  reduceMotion: false,
};

const PreferencesContext = createContext(null);

// Resolve the "system" theme to a concrete light/dark value at runtime.
export function resolveTheme(theme) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

function readStored() {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(readStored);

  const update = useCallback((patch) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ prefs, update, resolvedTheme: resolveTheme(prefs.theme) }),
    [prefs, update],
  );

  return createElement(
    PreferencesContext.Provider,
    { value },
    children,
  );
}

export const usePreferences = () => useContext(PreferencesContext);
