import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "./index.js";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = config.DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
