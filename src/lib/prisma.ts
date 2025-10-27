import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

export default prisma;
