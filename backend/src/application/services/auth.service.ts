import bcrypt from "bcryptjs";
import { authUsers } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class AuthService {
  static async findUserByEmail(email: string) {
    const [user] = await uow.authUsers.findAll(eq(authUsers.email, email.toLowerCase()));
    return user ?? null;
  }

  static async findUserById(id: string) {
    return await uow.authUsers.findById(id);
  }

  static async verifyPassword(passwordPlain: string, passwordHash: string) {
    return await bcrypt.compare(passwordPlain, passwordHash);
  }

  static async registerUser(
    email: string,
    passwordPlain: string,
    displayName?: string,
  ) {
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const passwordHash = await bcrypt.hash(passwordPlain, 12);

    const user = await uow.authUsers.create({
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName || email.split("@")[0],
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    return user;
  }

  static async createNewVerificationToken(userId: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const updated = await uow.authUsers.update(userId, {
      verificationToken: code,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return updated;
  }

  static async verifyUserEmail(userId: string) {
    const updated = await uow.authUsers.update(userId, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });
    return updated;
  }
}
