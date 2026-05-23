import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

function safeFormatZodError(error: ZodError): string {
  try {
    return fromZodError(error as any).message;
  } catch {
    const issues = error.issues ?? [];
    if (issues.length === 0) return "Validation error";
    return "Validation error: " + issues
      .map((i) => `${i.message}${i.path?.length ? ` at "${i.path.join(".")}"` : ""}`)
      .join("; ");
  }
}

export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: safeFormatZodError(error) });
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.query);
      Object.defineProperty(req, "query", {
        value: parsed,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: safeFormatZodError(error) });
      } else {
        next(error);
      }
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: safeFormatZodError(error) });
      } else {
        next(error);
      }
    }
  };
}
