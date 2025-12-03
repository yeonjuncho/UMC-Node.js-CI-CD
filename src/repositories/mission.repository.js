import { prisma } from "../db.config.js";

export const existsMission = async (missionId) => {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    select: { id: true },
  });
  return !!mission;
};

export const isAlreadyChallenging = async ({ memberId, missionId }) => {
  const existing = await prisma.userMission.findUnique({
    where: {
      userId_missionId: { userId: memberId, missionId },
    },
    select: { id: true },
  });
  return !!existing;
};

export const addMemberMission = async ({ memberId, missionId }) => {
  const created = await prisma.userMission.create({
    data: {
      userId: memberId,
      missionId,
      status: "ONGOING",
    },
    select: { id: true },
  });
  return created.id;
};
