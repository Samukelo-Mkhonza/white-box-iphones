import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_DURATION_MS = 1000 * 60 * 60; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Returns the raw token for the emailed link; only its hash is persisted.
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");

  // Invalidate any outstanding tokens so only the latest link works.
  await prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } });
  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_DURATION_MS),
    },
  });

  return token;
}

// Returns the token record (with user) if the raw token is valid, unexpired
// and unused; null otherwise.
export async function findValidPasswordResetToken(token: string) {
  if (!token) return null;

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;

  return record;
}
