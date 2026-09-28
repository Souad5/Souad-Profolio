import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ok } from "../utils/handler.js";
// Get the single settings document (with social links)
export async function getSettings(_req, res) {
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
export async function updateSettings(req, res) {
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
export async function addSocialLink(req, res) {
    const settings = await prisma.siteSetting.findFirst();
    if (!settings)
        throw new ApiError(404, "Settings not found");
    const created = await prisma.socialLink.create({
        data: { ...req.body, settingId: settings.id },
    });
    return ok(res, created, 201);
}
export async function updateSocialLink(req, res) {
    const id = Number(req.params.id);
    const updated = await prisma.socialLink.update({
        where: { id },
        data: req.body,
    });
    return ok(res, updated);
}
export async function deleteSocialLink(req, res) {
    const id = Number(req.params.id);
    await prisma.socialLink.delete({ where: { id } });
    return ok(res, { id });
}
//# sourceMappingURL=settings.js.map