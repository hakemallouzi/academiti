import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function ensureServerlessSqlite() {
  const onNetlify =
    process.env.NETLIFY === "true" ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (!onNetlify) return;

  const dest = "/tmp/academiti.db";
  if (!fs.existsSync(dest)) {
    const candidates = [
      path.join(process.cwd(), "prisma", "deploy.db"),
      path.join(process.cwd(), ".next", "server", "prisma", "deploy.db"),
    ];
    for (const src of candidates) {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        break;
      }
    }
  }

  // Prefer the writable /tmp copy at runtime
  if (fs.existsSync(dest)) {
    process.env.DATABASE_URL = `file:${dest}`;
  }
}

ensureServerlessSqlite();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
