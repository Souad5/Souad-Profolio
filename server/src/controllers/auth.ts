import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { signToken } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { ok } from "../utils/handler.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return ok(res, {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new ApiError(404, "User not found");
  return ok(res, { id: user.id, email: user.email, name: user.name, role: user.role });
}
