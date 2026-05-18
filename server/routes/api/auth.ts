import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../../db/index.js";
import { authUsers } from "../../../shared/schema.js";
import { eq, or } from "drizzle-orm";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_devstudio_2026_secure_random_string";
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
    isVerified: u.isVerified,
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
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [user] = await db.insert(authUsers).values({
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName || email.split("@")[0],
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    }).returning();

    console.log(`[auth] Dev Verification Code for ${user.email}: ${verificationToken}`);

    res.json({
      requireVerification: true,
      email: user.email,
      devVerificationCode: verificationToken,
      message: "Registration successful. Please verify your email.",
    });
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

    if (!user.isVerified) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await db.update(authUsers)
        .set({ verificationToken: code, verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), updatedAt: new Date() })
        .where(eq(authUsers.id, user.id));

      console.log(`[auth] New Dev Verification Code for ${user.email}: ${code}`);
      return res.status(403).json({
        error: "Please verify your email first",
        requireVerification: true,
        email: user.email,
        devVerificationCode: code,
      });
    }

    sendToken(res, user.id, safeUser(user));
  } catch (err) {
    console.error("[auth] login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and verification code are required" });

    const [user] = await db.select().from(authUsers).where(eq(authUsers.email, email.toLowerCase()));
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) {
      return sendToken(res, user.id, safeUser(user));
    }

    if (user.verificationToken !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
    }

    const [updated] = await db.update(authUsers)
      .set({ isVerified: true, verificationToken: null, verificationTokenExpires: null, updatedAt: new Date() })
      .where(eq(authUsers.id, user.id))
      .returning();

    sendToken(res, updated.id, safeUser(updated));
  } catch (err) {
    console.error("[auth] verify-email error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const [user] = await db.select().from(authUsers).where(eq(authUsers.email, email.toLowerCase()));
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.json({ message: "Email is already verified" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await db.update(authUsers)
      .set({ verificationToken: code, verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), updatedAt: new Date() })
      .where(eq(authUsers.id, user.id));

    console.log(`[auth] Resent Dev Verification Code for ${email}: ${code}`);
    res.json({ requireVerification: true, email: user.email, devVerificationCode: code });
  } catch (err) {
    console.error("[auth] resend-verification error:", err);
    res.status(500).json({ error: "Failed to resend verification code" });
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

router.get("/config", (_req: Request, res: Response) => {
  res.json({
    googleEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
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
      proxy: true,
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
            .set({ googleId, displayName: existing.displayName ?? displayName, avatarUrl: existing.avatarUrl ?? avatarUrl, isVerified: true, updatedAt: new Date() })
            .where(eq(authUsers.id, existing.id))
            .returning();
          return done(null, updated);
        }

        const [created] = await db.insert(authUsers).values({
          email,
          googleId,
          displayName,
          avatarUrl,
          isVerified: true,
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
