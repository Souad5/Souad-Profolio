import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAdmin, requireAdminAuthEnabled, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";
import {
  contactMessageSchema,
  siteSettingsSchema,
  socialLinkSchema,
  loginSchema,
  idParam,
  aboutSchema,
  skillCategorySchema,
  skillSchema,
  experienceSchema,
  educationSchema,
  projectSchema,
  serviceSchema,
  testimonialSchema,
  certificationSchema,
  achievementSchema,
  navigationItemSchema,
  sectionVisibilitySchema,
  mediaAssetSchema,
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
api.post("/auth/login", requireAdminAuthEnabled, validate(loginSchema), asyncHandler(login));
api.get("/auth/me", requireAuth, asyncHandler(me));

/* ------------------------------------------------------------------ */
/* Admin endpoints (protected)                                         */
/* ------------------------------------------------------------------ */
const admin = Router();
// Every admin route: valid token AND role ADMIN (403 otherwise).
admin.use(requireAdmin);
const id = validate(idParam, "params");
const reorderSchema = z.object({
  items: z.array(z.object({ id: z.coerce.number().int().positive(), order: z.coerce.number().int().min(0) })).min(1),
});

admin.get("/stats", asyncHandler(getStats));

admin.get("/site-settings", asyncHandler(getSettings));
admin.put("/site-settings", validate(siteSettingsSchema.partial()), asyncHandler(updateSettings));
admin.post("/social-links", validate(socialLinkSchema), asyncHandler(addSocialLink));
admin.put("/social-links/:id", id, validate(socialLinkSchema.partial()), asyncHandler(updateSocialLink));
admin.delete("/social-links/:id", id, asyncHandler(deleteSocialLink));

admin.get("/projects", asyncHandler(listProjects));
admin.get("/projects/:id", id, asyncHandler(getProjectById));
admin.post("/projects", validate(projectSchema), asyncHandler(createProject));
admin.post("/projects/:id/duplicate", id, asyncHandler(duplicateProject));
admin.put("/projects/:id", id, validate(projectSchema.partial()), asyncHandler(updateProject));
admin.delete("/projects/:id", id, asyncHandler(deleteProject));
// Must be declared before the generic skills mount (it has no conflicting
// PATCH /:id route, but keep the specific route first for clarity).
admin.patch("/skills/reorder", validate(reorderSchema), asyncHandler(skill.reorder));
admin.use("/skills", crudRoutes("skills", skill, skillSchema));
admin.use("/skill-categories", crudRoutes("skill-categories", skillCat, skillCategorySchema));
admin.use("/experience", crudRoutes("experience", experience, experienceSchema));
admin.use("/education", crudRoutes("education", education, educationSchema));
admin.use("/services", crudRoutes("services", service, serviceSchema));
admin.use("/testimonials", crudRoutes("testimonials", testimonial, testimonialSchema));
admin.use("/certifications", crudRoutes("certifications", certification, certificationSchema));
admin.use("/achievements", crudRoutes("achievements", achievement, achievementSchema));
admin.use("/navigation", crudRoutes("navigation", navigation, navigationItemSchema));
admin.use("/about", crudRoutes("about", about, aboutSchema));
admin.use("/sections", crudRoutes("sections", visibility, sectionVisibilitySchema));
admin.use("/media", crudRoutes("media", media, mediaAssetSchema));

admin.get("/contact-messages", asyncHandler(listMessages));
admin.patch("/contact-messages/:id/read", id, asyncHandler(markRead));
admin.delete("/contact-messages/:id", id, asyncHandler(deleteMessage));

api.use("/admin", admin);

export default api;
