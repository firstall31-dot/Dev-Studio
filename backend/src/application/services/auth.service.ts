import bcrypt from "bcryptjs";
import { db } from "../../infrastructure/database/index.js";
import { authUsers } from "../../domain/schema.js";
import { eq } from "drizzle-orm";

export class AuthService {
  static async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email.toLowerCase()));
    return user;
  }

  static async findUserById(id: string) {
    const [user] = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.id, id));
    return user;
  }

  static async verifyPassword(passwordPlain: string, passwordHash: string) {
    return await bcrypt.compare(passwordPlain, passwordHash);
  }

  static async registerUser(email: string, passwordPlain: string, displayName?: string) {
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const passwordHash = await bcrypt.hash(passwordPlain, 12);

    const [user] = await db
      .insert(authUsers)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        displayName: displayName || email.split("@")[0],
        isVerified: false,
        verificationToken,
        verificationTokenExpires,
      })
      .returning();

    return user;
  }

  static async createNewVerificationToken(userId: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const [updated] = await db
      .update(authUsers)
      .set({
        verificationToken: code,
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      })
      .where(eq(authUsers.id, userId))
      .returning();
    return updated;
  }

  static async verifyUserEmail(userId: string) {
    const [updated] = await db
      .update(authUsers)
      .set({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(authUsers.id, userId))
      .returning();
    return updated;
  }
}
