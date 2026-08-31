import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { crudController } from "../controllers/crud.js";

// Generic CRUD controllers (admin)
const skillCat = crudController(prisma.skillCategory);
const skill = crudController(prisma.skill, {
  searchFields: ["name"],
  defaultOrderBy: { order: "asc" },
  include: { category: true },
});
const experience = crudController(prisma.experience, {
  defaultOrderBy: [{ current: "desc" }, { order: "asc" }],
});
const education = crudController(prisma.education, { defaultOrderBy: { order: "asc" } });
const service = crudController(prisma.service, { defaultOrderBy: { order: "asc" } });
const testimonial = crudController(prisma.testimonial, {
  defaultOrderBy: [{ featured: "desc" }, { order: "asc" }],
});
const certification = crudController(prisma.certification, { defaultOrderBy: { order: "asc" } });
const achievement = crudController(prisma.achievement, { defaultOrderBy: { order: "asc" } });
const navigation = crudController(prisma.navigationItem, { defaultOrderBy: { order: "asc" } });
const about = crudController(prisma.about, { defaultOrderBy: { order: "asc" } });
const visibility = crudController(prisma.sectionVisibility, { defaultOrderBy: { order: "asc" } });
const media = crudController(prisma.mediaAsset, { defaultOrderBy: { createdAt: "desc" } });

// Builds a router of protected CRUD routes for an entity
function crudRoutes(path: string, ctrl: ReturnType<typeof crudController>, singular = "id") {
  const router = Router();
  router.get("/", ctrl.list);
  router.get(`/:${singular}`, ctrl.getById);
  router.post("/", ctrl.create);
  router.put(`/:${singular}`, ctrl.update);
  router.delete(`/:${singular}`, ctrl.remove);
  return router;
}

export { skillCat, skill, experience, education, service, testimonial, certification, achievement, navigation, about, visibility, media, crudRoutes };
