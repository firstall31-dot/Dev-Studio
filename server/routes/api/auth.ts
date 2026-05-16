import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../../db/index.js";
import { authUsers } from "../../../shared/schema.js";
import { eq, or } from "drizzle-orm";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "ds_token";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

function sendToken(res: Response, userId: string, user: Record<string, unknown>) {
  const token = signToken(userId);
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
  res.json({ user });
}

function safeUser(u: typeof authUsers.$inferSelect) {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    name: u.displayName ?? u.email ?? "User",
    profileImage: u.avatarUrl ?? null,
  };
}

// --- Email / Password ---

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

    const existing = await db.select().from(authUsers).where(eq(authUsers.email, email.toLowerCase()));
    if (existing.length > 0) return res.status(409).json({ error: "An account with this email already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(authUsers).values({
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName || email.split("@")[0],
    }).returning();

    sendToken(res, user.id, safeUser(user));
  } catch (err) {
    console.error("[auth] register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const [user] = await db.select().from(authUsers).where(eq(authUsers.email, email.toLowerCase()));
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    sendToken(res, user.id, safeUser(user));
  } catch (err) {
    console.error("[auth] login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

router.get("/user", (req: Request, res: Response) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    db.select().from(authUsers).where(eq(authUsers.id, payload.sub)).then(([user]) => {
      if (!user) return res.status(401).json({ error: "User not found" });
      res.json(safeUser(user));
    });
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
});

// --- Google OAuth ---

export function setupGooglePassport() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    console.warn("[auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — Google login disabled");
    return;
  }

  passport.use(new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase() ?? null;
        const googleId = profile.id;
        const displayName = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value ?? null;

        const [existing] = await db.select().from(authUsers).where(
          or(eq(authUsers.googleId, googleId), ...(email ? [eq(authUsers.email, email)] : []))
        );

        if (existing) {
          const [updated] = await db.update(authUsers)
            .set({ googleId, displayName: existing.displayName ?? displayName, avatarUrl: existing.avatarUrl ?? avatarUrl, updatedAt: new Date() })
            .where(eq(authUsers.id, existing.id))
            .returning();
          return done(null, updated);
        }

        const [created] = await db.insert(authUsers).values({
          email,
          googleId,
          displayName,
          avatarUrl,
        }).returning();
        return done(null, created);
      } catch (err) {
        return done(err as Error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.id, id));
    done(null, user ?? null);
  });
}

router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientID || !clientSecret) {
    return res.redirect("/auth?error=google_not_configured");
  }
  passport.authenticate("google", { session: false, scope: ["profile", "email"] })(req, res, next);
});

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth?error=google_failed" }),
  (req: Request, res: Response) => {
    const user = req.user as typeof authUsers.$inferSelect;
    if (!user) return res.redirect("/auth?error=google_failed");
    const token = signToken(user.id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    res.redirect("/");
  }
);

export default router;
