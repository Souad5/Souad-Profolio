import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? "development";
const rawSecret = process.env.JWT_SECRET ?? "";

// Values that must never sign real tokens: the code fallback and the
// placeholder committed in .env.example (anyone reading the repo knows them).
const KNOWN_PLACEHOLDERS = new Set(["dev-secret-change-me", "change-me-to-a-long-random-string"]);

/**
 * Admin auth is only enabled with a secret that is present, not a known
 * placeholder, and at least 32 characters. In production an unsafe secret
 * disables admin login/routes (503) instead of crashing, so the public
 * portfolio API keeps serving. In development it only warns.
 */
const secretIsSafe = rawSecret.length >= 32 && !KNOWN_PLACEHOLDERS.has(rawSecret);
const adminAuthEnabled = secretIsSafe || nodeEnv !== "production";

if (!secretIsSafe) {
  const msg =
    "JWT_SECRET is missing, too short (<32 chars) or a known placeholder. " +
    "Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\"";
  if (nodeEnv === "production") console.error(`[security] ${msg} Admin login is DISABLED.`);
  else console.warn(`[security] ${msg} (allowed in development only)`);
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  jwtSecret: rawSecret || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  adminAuthEnabled,
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  nodeEnv,
};
