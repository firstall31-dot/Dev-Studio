import { describe, it, expect, vi, beforeEach } from "vitest";
import { register, login } from "../auth.controller.js";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../../infrastructure/database/index.js";

// Mock the database infrastructure cleanly inside the hoisted factory
vi.mock("../../../infrastructure/database/index.js", () => {
  return {
    db: {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    },
  };
});

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;
  let cookieMock: any;
  const dbMock = db as any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Ensure all fluent return-this mocks are pre-configured
    dbMock.select.mockReturnThis();
    dbMock.from.mockReturnThis();
    dbMock.insert.mockReturnThis();
    dbMock.values.mockReturnThis();
    dbMock.update.mockReturnThis();
    dbMock.set.mockReturnThis();

    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnThis();
    cookieMock = vi.fn();
    req = {
      body: {},
    };
    res = {
      status: statusMock,
      json: jsonMock,
      cookie: cookieMock,
    };
  });

  describe("Register", () => {
    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "" };
      await register(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
    });

    it("should return 400 if password is too short", async () => {
      req.body = { email: "test@example.com", password: "123" };
      await register(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Password must be at least 6 characters",
      });
    });

    it("should return 409 if user already exists", async () => {
      req.body = { email: "existing@example.com", password: "password123" };
      dbMock.where.mockResolvedValueOnce([
        { id: "1", email: "existing@example.com" },
      ]);

      await register(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "An account with this email already exists",
      });
    });

    it("should successfully register a new user", async () => {
      req.body = {
        email: "new@example.com",
        password: "password123",
        displayName: "New User",
      };
      dbMock.where.mockResolvedValueOnce([]); // No existing user
      dbMock.returning.mockResolvedValueOnce([
        {
          id: "2",
          email: "new@example.com",
          displayName: "New User",
          isVerified: false,
          verificationToken: "123456",
        },
      ]);

      await register(req as Request, res as Response);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          requireVerification: true,
          email: "new@example.com",
          devVerificationCode: expect.any(String),
        }),
      );
    });
  });

  describe("Login", () => {
    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "" };
      await login(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
    });

    it("should return 401 if user is not found", async () => {
      req.body = { email: "nonexistent@example.com", password: "password123" };
      dbMock.where.mockResolvedValueOnce([]); // Empty array means no user found

      await login(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Invalid email or password",
      });
    });

    it("should return 401 if password is invalid", async () => {
      req.body = { email: "user@example.com", password: "wrongpassword" };
      const hash = await bcrypt.hash("correctpassword", 12);
      dbMock.where.mockResolvedValueOnce([
        { id: "1", email: "user@example.com", passwordHash: hash },
      ]);

      await login(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Invalid email or password",
      });
    });

    it("should return 403 if email is not verified", async () => {
      req.body = { email: "unverified@example.com", password: "password123" };
      const hash = await bcrypt.hash("password123", 12);
      dbMock.where.mockResolvedValueOnce([
        {
          id: "1",
          email: "unverified@example.com",
          passwordHash: hash,
          isVerified: false,
        },
      ]);
      dbMock.where.mockReturnValueOnce({
        returning: vi.fn().mockResolvedValueOnce([{}]),
      }); // For the update query where

      await login(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Please verify your email first",
          requireVerification: true,
        }),
      );
    });

    it("should successfully log in a verified user and set auth cookie", async () => {
      req.body = { email: "verified@example.com", password: "password123" };
      const hash = await bcrypt.hash("password123", 12);
      dbMock.where.mockResolvedValueOnce([
        {
          id: "1",
          email: "verified@example.com",
          passwordHash: hash,
          isVerified: true,
          displayName: "Verified User",
        },
      ]);

      await login(req as Request, res as Response);
      expect(cookieMock).toHaveBeenCalledWith(
        "ds_token",
        expect.any(String),
        expect.any(Object),
      );
      expect(jsonMock).toHaveBeenCalledWith({
        user: {
          id: "1",
          email: "verified@example.com",
          displayName: "Verified User",
          avatarUrl: undefined,
          name: "Verified User",
          profileImage: null,
          isVerified: true,
        },
      });
    });
  });
});
