import {
  MissionNotFoundError,
  InvalidRequestError,
  AlreadyChallengedError,
} from "../errors.js";
import { existsMission, isAlreadyChallenging, addMemberMission } from "../repositories/mission.repository.js";
import { prisma } from "../db.config.js";
import { findOngoingByUser } from "../repositories/userMission.repository.js";

export const challengeMission = async ({ missionId, memberId }) => {
  if (!(await existsMission(missionId))) {
    throw new MissionNotFoundError("미션을 찾을 수 없습니다.", { missionId });
  }

  if (!memberId) {
    throw new InvalidRequestError("회원 정보를 찾을 수 없습니다.", null);
  }

  if (await isAlreadyChallenging({ memberId, missionId })) {
    throw new AlreadyChallengedError("이미 도전 중인 미션입니다.", { memberId, missionId });
  }

  const memberMissionId = await addMemberMission({ memberId, missionId });
  return { memberMissionId };
};

export async function listStoreMissions({ storeId }) {
  return prisma.mission.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, rewardPoint: true, minPrice: true,
    },
  });
}

export async function listOngoingMissions({ userId }) {
  return findOngoingByUser({ userId }).then((rows) => ({
    items: rows.map((row) => ({
      id: row.id,
      status: row.status,
      startedAt: row.startedAt,
      mission: row.mission,
    })),
  }));
}