import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ok } from "../utils/handler.js";

// Get the single settings document (with social links)
export async function getSettings(_req: Request, res: Response) {
  let settings = await prisma.siteSetting.findFirst({
    include: { socialLinks: { orderBy: { order: "asc" } } },
  });

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {},
      include: { socialLinks: { orderBy: { order: "asc" } } },
    });
  }

  return ok(res, settings);
}

// Update settings document (partial update allowed)
export async function updateSettings(req: Request, res: Response) {
  let settings = await prisma.siteSetting.findFirst();
  if (!settings) {
    settings = await prisma.siteSetting.create({ data: {} });
  }

  const updated = await prisma.siteSetting.update({
    where: { id: settings.id },
    data: req.body,
    include: { socialLinks: { orderBy: { order: "asc" } } },
  });

  return ok(res, updated);
}

// ---- Social links ----
export async function addSocialLink(req: Request, res: Response) {
  const settings = await prisma.siteSetting.findFirst();
  if (!settings) throw new ApiError(404, "Settings not found");
  const created = await prisma.socialLink.create({
    data: { ...req.body, settingId: settings.id },
  });
  return ok(res, created, 201);
}

export async function updateSocialLink(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await prisma.socialLink.update({
    where: { id },
    data: req.body,
  });
  return ok(res, updated);
}

export async function deleteSocialLink(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.socialLink.delete({ where: { id } });
  return ok(res, { id });
}
