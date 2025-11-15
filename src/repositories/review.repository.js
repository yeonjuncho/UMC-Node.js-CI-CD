import { prisma } from "../db.config.js";

export const getAllStoreReviews = async ({ storeId, cursor, take = 5 }) => {
  const reviews = await prisma.review.findMany({
    where: {
      storeId,
      ...(cursor ? { id: { gt: cursor } } : {}),
    },
    orderBy: { id: "asc" },
    take: take + 1, // 다음 커서 확인을 위해 +1
    include: {
      store: { select: { id: true, name: true } },
      user: { select: { id: true, nickname: true } },
      images: true,
    },
  });
  
  return reviews;
};

export const getUserReviews = async ({ userId, cursor, take = 5 }) => {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
      ...(cursor ? { id: { gt: cursor } } : {}),
    },
    orderBy: { id: "asc" },
    take: take + 1,
    include: {
      store: { select: { id: true, name: true } },
      user: { select: { id: true, nickname: true } },
      images: true,
    },
  });
  return reviews;
};