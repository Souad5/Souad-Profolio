import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Hosts a public site must never call: Chrome answers such requests with a
// Local Network Access permission prompt for every visitor.
const LOCAL_HOST =
  /^(localhost|127(\.\d+){3}|\[::1\]|0\.0\.0\.0|10(\.\d+){3}|192\.168(\.\d+){2}|172\.(1[6-9]|2\d|3[01])(\.\d+){2}|.+\.local)$/i;

function assertProductionApiUrl(env) {
  if (process.env.ALLOW_LOCAL_API === "1") return; // intentional local production preview
  const url = env.VITE_API_URL;
  if (!url) {
    throw new Error(
      "VITE_API_URL is not set. Production builds need the deployed API URL " +
        "(e.g. https://<your-api>.vercel.app/api) — set it in Netlify's environment variables."
    );
  }
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error(`VITE_API_URL is not a valid URL: ${url}`);
  }
  if (LOCAL_HOST.test(host)) {
    throw new Error(
      `VITE_API_URL points at a local/private address (${host}). Visitors' browsers would ` +
        "show a Local Network Access permission prompt. Use the deployed API URL " +
        "(or set ALLOW_LOCAL_API=1 for a local production preview)."
    );
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === "build") assertProductionApiUrl(loadEnv(mode, process.cwd(), ""));
  return {
    resolve: {
      alias: {
        "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
    },
  };
});
