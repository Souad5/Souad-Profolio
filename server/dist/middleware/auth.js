import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
export function signToken(payload) {
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn,
    });
}
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        throw new ApiError(401, "Authentication required");
    }
    const token = header.slice(7);
    try {
        req.user = jwt.verify(token, env.jwtSecret);
        next();
    }
    catch {
        throw new ApiError(401, "Invalid or expired token");
    }
}
//# sourceMappingURL=auth.js.map