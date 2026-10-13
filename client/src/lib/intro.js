import { useSyncExternalStore } from "react";

// The hacker-terminal preloader plays on every full load of the public home
// page (never on /admin or a 404). index.html applies the same path rule
// before first paint to hide its static boot shell.

// Decided once at load, so a client-side navigation never replays it.
const play = typeof window !== "undefined" && window.location.pathname === "/";

let done = !play;
const listeners = new Set();

if (!play && typeof document !== "undefined") {
  document.getElementById("boot-shell")?.remove();
}

export const shouldPlayIntro = () => play;

/** Called when the preloader starts its exit: the page underneath may animate in. */
export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** True once the preloader is leaving (or was never shown). */
export const useIntroDone = () => useSyncExternalStore(subscribe, () => done);
