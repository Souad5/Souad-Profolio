import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { crudController } from "../controllers/crud.js";
import { asyncHandler } from "../utils/handler.js";

// Generic CRUD controllers (admin)
const skillCat = crudController(prisma.skillCategory);
const skill = crudController(prisma.skill, {
  searchFields: ["name"],
  defaultOrderBy: { order: "asc" },
  include: { category: true },
  requiredFields: ["categoryId"],
  preprocess: (data) => ({
    ...data,
    // The admin <select> posts categoryId as a string; Prisma Int fields
    // require a number (defensive against any client sending a string).
    categoryId:
      data.categoryId == null || data.categoryId === ""
        ? undefined
        : Number(data.categoryId),
  }),
});

// The admin date inputs post values like "2025-12-01" (date-only), but Prisma
// DateTime fields require a full ISO-8601 timestamp. Coerce YYYY-MM-DD into a
// valid datetime before it reaches Prisma.
const toDateTime = (value: unknown): unknown => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`).toISOString();
  }
  return value;
};

const experience = crudController(prisma.experience, {
  defaultOrderBy: [{ current: "desc" }, { order: "asc" }],
  preprocess: (data) => ({
    ...data,
    startDate: toDateTime(data.startDate),
    endDate:
      data.endDate == null || data.endDate === ""
        ? null
        : toDateTime(data.endDate),
  }),
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
  router.get("/", asyncHandler(ctrl.list));
  router.get(`/:${singular}`, asyncHandler(ctrl.getById));
  router.post("/", asyncHandler(ctrl.create));
  router.put(`/:${singular}`, asyncHandler(ctrl.update));
  router.delete(`/:${singular}`, asyncHandler(ctrl.remove));
  return router;
}

export { skillCat, skill, experience, education, service, testimonial, certification, achievement, navigation, about, visibility, media, crudRoutes };
