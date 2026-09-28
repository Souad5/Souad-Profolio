import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import api from "./routes/public.js";
import { errorHandler, notFound } from "./middleware/error.js";
const app = express();
// On Vercel requests arrive through one proxy hop; without this every client
// shares the proxy's IP, so the rate limiters below would throttle (or lock
// out) everyone at once. Only in production: locally it would let callers
// spoof X-Forwarded-For to dodge the limits.
if (env.nodeEnv === "production")
    app.set("trust proxy", 1);
app.use(helmet());
// Reflect request origin: supports localhost, LAN IPs, and deployed domains.
// Safe because auth uses Bearer tokens (Authorization header), not cookies —
// the browser never attaches credentials automatically, so there is no CSRF
// surface. `credentials` is deliberately off: nothing relies on cookies.
app.use(cors({
    origin: true,
    credentials: false,
}));
app.use(express.json({ limit: "2mb" }));
if (env.nodeEnv === "development") {
    app.use(morgan("dev"));
}
else {
    app.use(morgan("combined"));
}
// Brute-force protection: 10 failed logins per 15 min per IP (successful
// logins don't count, so a real admin is never locked out by their own use).
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many login attempts, try again in 15 minutes" },
});
app.use("/api/auth/login", authLimiter);
// Public contact form: spam/abuse protection (5 messages per 10 min per IP).
const contactLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many messages, please try again later" },
});
app.post("/api/contact", contactLimiter);
// General API ceiling. One portfolio page load makes ~15 API calls and many
// visitors share an IP (offices, mobile carriers), so this is deliberately
// generous; the sensitive endpoints above have their own strict limits.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", apiLimiter);
app.use("/api", api);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(notFound);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map