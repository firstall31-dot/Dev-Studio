import type { Request, Response, NextFunction } from "express";

/**
 * Disables all caching in non-production environments so that
 * API responses are always fresh during development.
 */
export function noCacheMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}
