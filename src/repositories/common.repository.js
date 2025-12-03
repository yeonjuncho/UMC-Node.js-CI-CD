import { prisma } from "../db.config.js";

export const getFirstMemberId = async () => {
  const first = await prisma.user.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });
  return first?.id ?? null;
};