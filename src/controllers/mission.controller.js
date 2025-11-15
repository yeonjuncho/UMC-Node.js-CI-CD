import { StatusCodes } from "http-status-codes";
import { InvalidRequestError } from "../errors.js";
import { challengeMission, listStoreMissions, listOngoingMissions } from "../services/mission.service.js";

export const handleChallengeMission = async (req, res, next) => {
  const missionId = Number(req.params.missionId);
  if (!Number.isInteger(missionId) || missionId <= 0) {
    throw new InvalidRequestError("유효하지 않은 missionId입니다.", { missionId });
  }

  const result = await challengeMission({ missionId });
  res.status(StatusCodes.CREATED).success(result);
};

export const handleListOngoingMissions = async (req, res, next) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new InvalidRequestError("유효하지 않은 userId입니다.", { userId });
  }

  const result = await listOngoingMissions({ userId });
  res.status(StatusCodes.OK).success(result);
};

export const handleListStoreMissions = async (req, res, next) => {
  const storeId = Number(req.params.storeId);
  if (!Number.isInteger(storeId) || storeId <= 0) {
    throw new InvalidRequestError("유효하지 않은 storeId입니다.", { storeId });
  }

  const missions = await listStoreMissions({ storeId });
  res.status(StatusCodes.OK).success({ items: missions });
};