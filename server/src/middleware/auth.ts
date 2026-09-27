import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}

const ALGORITHM = "HS256";

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, env.jwtSecret, {
    algorithm: ALGORITHM,
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

/** Blocks admin auth entirely when the server's JWT secret is unsafe (see config/env). */
export function requireAdminAuthEnabled(_req: Request, _res: Response, next: NextFunction) {
  if (!env.adminAuthEnabled) {
    throw new ApiError(503, "Admin is disabled: the server's JWT_SECRET is not configured securely");
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  requireAdminAuthEnabled(req, res, () => undefined);
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }
  const token = header.slice(7);
  try {
    // Pin the algorithm so a token can't pick a weaker/unsigned one.
    req.user = jwt.verify(token, env.jwtSecret, { algorithms: [ALGORITHM] }) as AuthPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
  next();
}

/** Authenticated AND an admin. Used for every /api/admin route. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => undefined);
  if (req.user?.role !== "ADMIN") {
    throw new ApiError(403, "Admin privileges required");
  }
  next();
}
