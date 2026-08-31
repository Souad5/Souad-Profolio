import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  contactMessageSchema,
  siteSettingsSchema,
  socialLinkSchema,
  loginSchema,
} from "../schemas/index.js";
import { login, me } from "../controllers/auth.js";
import {
  getSettings,
  updateSettings,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from "../controllers/settings.js";
import {
  listProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
} from "../controllers/project.js";
import {
  createContactMessage,
  listMessages,
  markRead,
  deleteMessage,
} from "../controllers/contact.js";
import { getStats } from "../controllers/dashboard.js";
import { ok, asyncHandler } from "../utils/handler.js";
import {
  skillCat,
  skill,
  experience,
  education,
  service,
  testimonial,
  certification,
  achievement,
  navigation,
  about,
  visibility,
  media,
  crudRoutes,
} from "./entities.js";

const api = Router();

/* ------------------------------------------------------------------ */
/* Public endpoints (no auth)                                          */
/* ------------------------------------------------------------------ */

api.get("/site-settings", asyncHandler(getSettings));
api.get("/seo", asyncHandler(async (_req, res) => {
  const s = await prisma.siteSetting.findFirst();
  return ok(res, {
    title: s?.seoTitle ?? "",
    description: s?.seoDescription ?? "",
    keywords: s?.seoKeywords ?? "",
    ogImage: s?.seoOgImage ?? "",
    author: s?.seoAuthor ?? "",
    canonicalUrl: s?.seoCanonicalUrl ?? "",
  });
}));
api.get("/navigation", asyncHandler(async (_req, res) => {
  const items = await prisma.navigationItem.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
}));
api.get("/sections", asyncHandler(async (_req, res) => {
  const items = await prisma.sectionVisibility.findMany({
    orderBy: { order: "asc" },
  });
  return ok(res, items);
}));
api.get("/about", asyncHandler(async (_req, res) => {
  const item = await prisma.about.findFirst({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, item);
}));
api.get("/skills", asyncHandler(async (_req, res) => {
  const cats = await prisma.skillCategory.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
    include: { skills: { where: { enabled: true }, orderBy: { order: "asc" } } },
  });
  return ok(res, cats);
}));
api.get("/experience", asyncHandler(async (_req, res) => {
  const items = await prisma.experience.findMany({
    where: { enabled: true },
    orderBy: [{ current: "desc" }, { order: "asc" }],
  });
  return ok(res, items);
}));
api.get("/education", asyncHandler(async (_req, res) => {
  const items = await prisma.education.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
}));
api.get("/projects", asyncHandler(async (req, res) => {
  req.query = { ...req.query, published: "true" };
  return listProjects(req, res);
}));
api.get("/projects/:slug", asyncHandler(getProjectBySlug));
api.get("/services", asyncHandler(async (_req, res) => {
  const items = await prisma.service.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
}));
api.get("/testimonials", asyncHandler(async (_req, res) => {
  const items = await prisma.testimonial.findMany({
    where: { enabled: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  return ok(res, items);
}));
api.get("/certifications", asyncHandler(async (_req, res) => {
  const items = await prisma.certification.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
}));
api.get("/achievements", asyncHandler(async (_req, res) => {
  const items = await prisma.achievement.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
}));
api.post("/contact", validate(contactMessageSchema), asyncHandler(createContactMessage));

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */
api.post("/auth/login", validate(loginSchema), asyncHandler(login));
api.get("/auth/me", requireAuth, asyncHandler(me));

/* ------------------------------------------------------------------ */
/* Admin endpoints (protected)                                         */
/* ------------------------------------------------------------------ */
const admin = Router();
admin.use(requireAuth);

admin.get("/stats", asyncHandler(getStats));

admin.get("/site-settings", asyncHandler(getSettings));
admin.put("/site-settings", validate(siteSettingsSchema.partial()), asyncHandler(updateSettings));
admin.post("/social-links", validate(socialLinkSchema), asyncHandler(addSocialLink));
admin.put("/social-links/:id", validate(socialLinkSchema.partial()), asyncHandler(updateSocialLink));
admin.delete("/social-links/:id", asyncHandler(deleteSocialLink));

admin.get("/projects", asyncHandler(listProjects));
admin.get("/projects/:id", asyncHandler(getProjectById));
admin.post("/projects", asyncHandler(createProject));
admin.post("/projects/:id/duplicate", asyncHandler(duplicateProject));
admin.put("/projects/:id", asyncHandler(updateProject));
admin.delete("/projects/:id", asyncHandler(deleteProject));
admin.use("/skills", crudRoutes("skills", skill));
admin.use("/skill-categories", crudRoutes("skill-categories", skillCat));
admin.use("/experience", crudRoutes("experience", experience));
admin.use("/education", crudRoutes("education", education));
admin.use("/services", crudRoutes("services", service));
admin.use("/testimonials", crudRoutes("testimonials", testimonial));
admin.use("/certifications", crudRoutes("certifications", certification));
admin.use("/achievements", crudRoutes("achievements", achievement));
admin.use("/navigation", crudRoutes("navigation", navigation));
admin.use("/about", crudRoutes("about", about));
admin.use("/sections", crudRoutes("sections", visibility));
admin.use("/media", crudRoutes("media", media));

admin.get("/contact-messages", asyncHandler(listMessages));
admin.patch("/contact-messages/:id/read", asyncHandler(markRead));
admin.delete("/contact-messages/:id", asyncHandler(deleteMessage));

api.use("/admin", admin);

export default api;
