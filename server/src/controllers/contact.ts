import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ok } from "../utils/handler.js";

export async function createContactMessage(req: Request, res: Response) {
  const { name, email, subject, message } = req.body;
  const item = await prisma.contactMessage.create({
    data: { name, email, subject: subject ?? "", message },
  });
  return ok(res, item, 201);
}

export async function listMessages(req: Request, res: Response) {
  const { page = "1", limit = "50", read } = req.query as Record<string, any>;
  const where: any = {};
  if (read !== undefined) where.read = read === "true";
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const [items, total, unread] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);
  return ok(res, { items, total, unread, page: pageNum, limit: limitNum });
}

export async function markRead(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
  return ok(res, item);
}

export async function deleteMessage(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.contactMessage.delete({ where: { id } });
  return ok(res, { id });
}
