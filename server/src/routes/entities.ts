import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { crudController } from "../controllers/crud.js";
import { asyncHandler } from "../utils/handler.js";
import type { ZodObject, ZodRawShape } from "zod";
import { validate } from "../middleware/validate.js";
import { idParam } from "../schemas/index.js";

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

// Builds a router of protected CRUD routes for an entity. Writes are validated
// with the entity's Zod schema (full on create, partial on update); unknown
// keys such as id/createdAt are stripped, so they can't be mass-assigned.
function crudRoutes(
  path: string,
  ctrl: ReturnType<typeof crudController>,
  schema: ZodObject<ZodRawShape>,
) {
  const router = Router();
  const id = validate(idParam, "params");
  router.get("/", asyncHandler(ctrl.list));
  router.get("/:id", id, asyncHandler(ctrl.getById));
  router.post("/", validate(schema), asyncHandler(ctrl.create));
  router.put("/:id", id, validate(schema.partial()), asyncHandler(ctrl.update));
  router.delete("/:id", id, asyncHandler(ctrl.remove));
  return router;
}

export { skillCat, skill, experience, education, service, testimonial, certification, achievement, navigation, about, visibility, media, crudRoutes };
