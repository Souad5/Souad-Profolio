import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
const ALGORITHM = "HS256";
export function signToken(payload) {
    return jwt.sign(payload, env.jwtSecret, {
        algorithm: ALGORITHM,
        expiresIn: env.jwtExpiresIn,
    });
}
/** Blocks admin auth entirely when the server's JWT secret is unsafe (see config/env). */
export function requireAdminAuthEnabled(_req, _res, next) {
    if (!env.adminAuthEnabled) {
        throw new ApiError(503, "Admin is disabled: the server's JWT_SECRET is not configured securely");
    }
    next();
}
export function requireAuth(req, res, next) {
    requireAdminAuthEnabled(req, res, () => undefined);
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        throw new ApiError(401, "Authentication required");
    }
    const token = header.slice(7);
    try {
        // Pin the algorithm so a token can't pick a weaker/unsigned one.
        req.user = jwt.verify(token, env.jwtSecret, { algorithms: [ALGORITHM] });
    }
    catch {
        throw new ApiError(401, "Invalid or expired token");
    }
    next();
}
/** Authenticated AND an admin. Used for every /api/admin route. */
export function requireAdmin(req, res, next) {
    requireAuth(req, res, () => undefined);
    if (req.user?.role !== "ADMIN") {
        throw new ApiError(403, "Admin privileges required");
    }
    next();
}
//# sourceMappingURL=auth.js.map