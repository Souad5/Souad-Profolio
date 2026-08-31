/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from "express";
import type { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
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
}

export function crudController(
  delegate: PrismaDelegate,
  options: CrudOptions = {},
) {
  const {
    searchFields = [],
    defaultOrderBy = { order: "asc" },
    include,
    preprocess,
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
    const data = preprocess ? preprocess(req.body) : req.body;
    const item = await delegate.create({ data });
    return created(res, item);
  };

  const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = preprocess ? preprocess(req.body) : req.body;
    const item = await delegate.update({ where: { id }, data });
    return ok(res, item);
  };

  const remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await delegate.delete({ where: { id } });
    return ok(res, { id });
  };

  return { list, getById, create, update, remove };
}

export const withPrisma = (client: PrismaClient) => client;
