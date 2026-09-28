import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { created, ok } from "../utils/handler.js";
function slugify(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 80);
}
async function uniqueSlug(title, excludeId) {
    const base = slugify(title) || "project";
    let candidate = base;
    let i = 1;
    const existing = await prisma.project.findMany({
        where: excludeId
            ? { slug: { startsWith: base }, id: { not: excludeId } }
            : { slug: { startsWith: base } },
        select: { slug: true },
    });
    const used = new Set(existing.map((p) => p.slug));
    while (used.has(candidate)) {
        candidate = `${base}-${i++}`;
    }
    return candidate;
}
export async function listProjects(req, res) {
    const { page = "1", limit = "500", search, published, featured, } = req.query;
    const where = {};
    if (published !== undefined)
        where.published = published === "true";
    if (featured !== undefined)
        where.featured = featured === "true";
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
        ];
    }
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10) || 500));
    const skip = (pageNum - 1) * limitNum;
    const [items, total] = await Promise.all([
        prisma.project.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: [{ featured: "desc" }, { order: "asc" }],
        }),
        prisma.project.count({ where }),
    ]);
    return ok(res, { items, total, page: pageNum, limit: limitNum });
}
export async function getProjectBySlug(req, res) {
    const slug = String(req.params.slug);
    const item = await prisma.project.findUnique({ where: { slug } });
    if (!item)
        throw new ApiError(404, "Project not found");
    return ok(res, item);
}
export async function getProjectById(req, res) {
    const id = Number(req.params.id);
    const item = await prisma.project.findUnique({ where: { id } });
    if (!item)
        throw new ApiError(404, "Project not found");
    return ok(res, item);
}
export async function createProject(req, res) {
    const data = { ...req.body };
    if (!data.slug || data.slug.length < 2) {
        data.slug = await uniqueSlug(data.title);
    }
    else {
        data.slug = data.slug.toLowerCase().trim().replace(/\s+/g, "-");
    }
    const item = await prisma.project.create({ data });
    return created(res, item);
}
export async function updateProject(req, res) {
    const id = Number(req.params.id);
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    if (data.title) {
        data.slug = await uniqueSlug(data.title, id);
    }
    else if (data.slug) {
        data.slug = data.slug.toLowerCase().trim().replace(/\s+/g, "-");
    }
    const item = await prisma.project.update({ where: { id }, data });
    return ok(res, item);
}
export async function deleteProject(req, res) {
    const id = Number(req.params.id);
    await prisma.project.delete({ where: { id } });
    return ok(res, { id });
}
export async function duplicateProject(req, res, _next) {
    const id = Number(req.params.id);
    const source = await prisma.project.findUnique({ where: { id } });
    if (!source)
        throw new ApiError(404, "Project not found");
    const { id: _oldId, createdAt: _c, updatedAt: _u, slug: _slug, ...rest } = source;
    const item = await prisma.project.create({
        data: {
            ...rest,
            title: `${rest.title} (Copy)`,
            slug: await uniqueSlug(`${rest.title} Copy`),
        },
    });
    return created(res, item);
}
//# sourceMappingURL=project.js.map