import { prisma } from "../db.config.js";

export const existsStore = async (storeId) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true },
  });
  return !!store;
};

export const createMission = async ({
  storeId,
  rewardPoint,
  minPrice,
  title,
}) => {
  const mission = await prisma.mission.create({
    data: {
      storeId,
      rewardPoint,
      minPrice,
      title,
    },
    select: { id: true },
  });
  return mission.id;
};

// 리뷰 + 이미지 (트랜잭션)
export const createReviewWithImages = async ({
  memberId,
  storeId,
  score,
  text,
  images = [],
}) => {
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        userId: memberId,
        storeId,
        rating: score,
        content: text,
        images: images.length
          ? {
              createMany: {
                data: images.map((url) => ({ url })),
              },
            }
          : undefined,
      },
      select: { id: true },
    });

    return review.id;
  });

  return result;
};