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
import { ok } from "../utils/handler.js";
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

api.get("/site-settings", getSettings);
api.get("/seo", async (_req, res) => {
  const s = await prisma.siteSetting.findFirst();
  return ok(res, {
    title: s?.seoTitle ?? "",
    description: s?.seoDescription ?? "",
    keywords: s?.seoKeywords ?? "",
    ogImage: s?.seoOgImage ?? "",
    author: s?.seoAuthor ?? "",
    canonicalUrl: s?.seoCanonicalUrl ?? "",
  });
});
api.get("/navigation", async (_req, res) => {
  const items = await prisma.navigationItem.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
});
api.get("/sections", async (_req, res) => {
  const items = await prisma.sectionVisibility.findMany({
    orderBy: { order: "asc" },
  });
  return ok(res, items);
});
api.get("/about", async (_req, res) => {
  const item = await prisma.about.findFirst({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, item);
});
api.get("/skills", async (_req, res) => {
  const cats = await prisma.skillCategory.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
    include: { skills: { where: { enabled: true }, orderBy: { order: "asc" } } },
  });
  return ok(res, cats);
});
api.get("/experience", async (_req, res) => {
  const items = await prisma.experience.findMany({
    where: { enabled: true },
    orderBy: [{ current: "desc" }, { order: "asc" }],
  });
  return ok(res, items);
});
api.get("/education", async (_req, res) => {
  const items = await prisma.education.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
});
api.get("/projects", async (req, res) => {
  req.query = { ...req.query, published: "true" };
  return listProjects(req, res);
});
api.get("/projects/:slug", getProjectBySlug);
api.get("/services", async (_req, res) => {
  const items = await prisma.service.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
});
api.get("/testimonials", async (_req, res) => {
  const items = await prisma.testimonial.findMany({
    where: { enabled: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  return ok(res, items);
});
api.get("/certifications", async (_req, res) => {
  const items = await prisma.certification.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
});
api.get("/achievements", async (_req, res) => {
  const items = await prisma.achievement.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return ok(res, items);
});
api.post("/contact", validate(contactMessageSchema), createContactMessage);

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */
api.post("/auth/login", validate(loginSchema), login);
api.get("/auth/me", requireAuth, me);

/* ------------------------------------------------------------------ */
/* Admin endpoints (protected)                                         */
/* ------------------------------------------------------------------ */
const admin = Router();
admin.use(requireAuth);

admin.get("/stats", getStats);

admin.get("/site-settings", getSettings);
admin.put("/site-settings", validate(siteSettingsSchema.partial()), updateSettings);
admin.post("/social-links", validate(socialLinkSchema), addSocialLink);
admin.put("/social-links/:id", validate(socialLinkSchema.partial()), updateSocialLink);
admin.delete("/social-links/:id", deleteSocialLink);

admin.get("/projects", listProjects);
admin.get("/projects/:id", getProjectById);
admin.post("/projects", createProject);
admin.post("/projects/:id/duplicate", duplicateProject);
admin.put("/projects/:id", updateProject);
admin.delete("/projects/:id", deleteProject);
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

admin.get("/contact-messages", listMessages);
admin.patch("/contact-messages/:id/read", markRead);
admin.delete("/contact-messages/:id", deleteMessage);

api.use("/admin", admin);

export default api;
