import { prisma } from "../db.config.js";

export const findOngoingByUser = async ({ userId }) => {
  return prisma.userMission.findMany({
    where: { userId, status: "ONGOING" },
    orderBy: { startedAt: "desc" },
    include: {
      mission: {
        select: {
          id: true,
          title: true,
          rewardPoint: true,
          minPrice: true,
          store: { select: { id: true, name: true } },
        },
      },
    },
  });
};