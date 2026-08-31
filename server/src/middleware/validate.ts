import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError.js";

type Loc = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, loc: Loc = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[loc]);
      (req as any)[loc] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ");
        throw new ApiError(400, message);
      }
      throw err;
    }
  };
