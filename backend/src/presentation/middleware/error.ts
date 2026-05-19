import type { Request, Response, NextFunction } from "express";

/**
 * Global error-handling middleware.
 *
 * Must be registered LAST in Express (after all routes) and must have
 * 4 parameters so Express recognises it as an error handler.
 *
 * Catches:
 *  - Explicit `next(err)` calls from any route or middleware
 *  - Unhandled promise rejections forwarded by express-async-errors (if used)
 *
 * Response shape:
 *  { error: string, ...(dev-only: stack) }
 */
export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isProd = process.env.NODE_ENV === "production";

  // Normalise the error
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";

  const statusCode =
    (err as { statusCode?: number })?.statusCode ??
    (err as { status?: number })?.status ??
    500;

  console.error("[error]", err);

  res.status(statusCode).json({
    error: message,
    ...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
  });
}

/**
 * 404 Not Found handler — register just before globalErrorHandler.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}
