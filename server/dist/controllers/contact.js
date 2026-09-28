import { prisma } from "../config/prisma.js";
import { ok } from "../utils/handler.js";
export async function createContactMessage(req, res) {
    const { name, email, subject, message } = req.body;
    const item = await prisma.contactMessage.create({
        data: { name, email, subject: subject ?? "", message },
    });
    return ok(res, item, 201);
}
export async function listMessages(req, res) {
    const { page = "1", limit = "50", read } = req.query;
    const where = {};
    if (read !== undefined)
        where.read = read === "true";
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
export async function markRead(req, res) {
    const id = Number(req.params.id);
    const item = await prisma.contactMessage.update({
        where: { id },
        data: { read: true },
    });
    return ok(res, item);
}
export async function deleteMessage(req, res) {
    const id = Number(req.params.id);
    await prisma.contactMessage.delete({ where: { id } });
    return ok(res, { id });
}
//# sourceMappingURL=contact.js.map