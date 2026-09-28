import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);
const KEY = "portfolio_theme";
const RIPPLE_MS = 500;

function apply(theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(prefersDark ? "dark" : "light");
  } else {
    root.classList.add(theme);
  }
}

// Ripple origin: the click point, or the control's centre when it was
// activated from the keyboard (those clicks report 0,0).
function originOf(event) {
  const target = event?.currentTarget;
  if (event && (event.clientX || event.clientY)) return { x: event.clientX, y: event.clientY };
  if (target?.getBoundingClientRect) {
    const r = target.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(KEY) || "system");

  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  // Flip light/dark with a circular reveal expanding from the toggle.
  const toggleTheme = useCallback((event) => {
    const root = document.documentElement;
    // Read the *rendered* theme so "system" resolves correctly.
    const next = root.classList.contains("dark") ? "light" : "dark";

    // The DOM must be fully updated by the time the callback returns, so the
    // view transition snapshots the new theme: commit React state
    // synchronously and apply the class directly.
    const commit = () => {
      flushSync(() => setTheme(next));
      apply(next);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof document.startViewTransition !== "function" || reduceMotion) {
      commit();
      return;
    }

    const { x, y } = originOf(event);
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Lets the CSS layer the snapshots for this direction.
    root.dataset.themeTransition = next;
    const transition = document.startViewTransition(commit);

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: RIPPLE_MS,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});

    transition.finished.finally(() => {
      delete root.dataset.themeTransition;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
