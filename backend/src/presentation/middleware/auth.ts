import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "ds_token";

export function getUserId(req: Request): string | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        sub: string;
      };
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

export function requireUser(req: Request, res: Response): string | null {
  const id = getUserId(req);
  if (!id) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return id;
}

export function stripDates(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const { createdAt, updatedAt, created_at, updated_at, ...rest } = data;
  void createdAt;
  void updatedAt;
  void created_at;
  void updated_at;
  return rest;
}

export function isUUID(id: unknown): id is string {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
}
