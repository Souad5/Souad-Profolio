/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from "express";
import type { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/prisma.js";
import { created, ok } from "../utils/handler.js";

type PrismaDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  count: (args?: any) => Promise<number>;
  findUnique: (args: { where: { id: number }; include?: any }) => Promise<any>;
  create: (args: { data: any }) => Promise<any>;
  update: (args: { where: { id: number }; data: any }) => Promise<any>;
  delete: (args: { where: { id: number } }) => Promise<any>;
};

interface CrudOptions {
  searchFields?: string[];
  defaultOrderBy?: Record<string, any>;
  include?: Record<string, any>;
  preprocess?: (data: any) => any;
  requiredFields?: string[];
}

/** Prisma rejects `undefined` values on required fields; drop them first. */
const withoutUndefined = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

export function crudController(
  delegate: PrismaDelegate,
  options: CrudOptions = {},
) {
  const {
    searchFields = [],
    defaultOrderBy = { order: "asc" },
    include,
    preprocess,
    requiredFields = [],
  } = options;

  const list = async (req: Request, res: Response) => {
    const {
      page = "1",
      limit = "500",
      search,
      enabled,
      published,
      featured,
    } = req.query as Record<string, any>;

    const where: any = {};
    if (enabled !== undefined) where.enabled = enabled === "true";
    if (published !== undefined) where.published = published === "true";
    if (featured !== undefined) where.featured = featured === "true";
    if (search && searchFields.length) {
      where.OR = searchFields.map((f) => ({
        [f]: { contains: search, mode: "insensitive" },
      }));
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10) || 500));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: defaultOrderBy,
        include,
      }),
      delegate.count({ where }),
    ]);

    return ok(res, { items, total, page: pageNum, limit: limitNum });
  };

  const getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await delegate.findUnique({ where: { id }, include });
    if (!item) throw new ApiError(404, "Record not found");
    return ok(res, item);
  };

  const create = async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as Record<string, any>;
    const missing = requiredFields.filter((f) => body[f] == null || body[f] === "");
    if (missing.length) {
      throw new ApiError(400, `Missing required field(s): ${missing.join(", ")}`);
    }
    const data = withoutUndefined(preprocess ? preprocess(body) : body);
    const item = await delegate.create({ data });
    return created(res, item);
  };

  const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = withoutUndefined(preprocess ? preprocess(req.body) : req.body);
    const item = await delegate.update({ where: { id }, data });
    return ok(res, item);
  };

  const remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await delegate.delete({ where: { id } });
    return ok(res, { id });
  };

  const reorder = async (req: Request, res: Response) => {
    const items = req.body?.items ?? req.body;
    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some((it) => it == null || it.id == null || it.order == null)
    ) {
      throw new ApiError(400, "Expected an array of { id, order } objects");
    }
    // Batch update every row's order in a single transaction so the list is
    // never left half-reordered if one update fails.
    await prisma.$transaction(
      items.map((it) =>
        delegate.update({
          where: { id: Number(it.id) },
          data: { order: Number(it.order) },
        }),
      ) as any,
    );
    return ok(res, { updated: items.length });
  };

  return { list, getById, create, update, remove, reorder };
}

export const withPrisma = (client: PrismaClient) => client;
