import { StatusCodes } from "http-status-codes";
import { bodyToReview, bodyToMission } from "../dtos/store.dto.js";
import { addReviewToStore, addMissionToStore } from "../services/store.service.js";

export const handleAddReview = async (req, res, next) => {
  console.log("[POST] /stores/:storeId/reviews hit", req.params, req.body);
  const storeId = Number(req.params.storeId);
  const review = bodyToReview(req.body);
  const memberId = req.user.id;
  const result = await addReviewToStore({ storeId, review, memberId });
  res.status(StatusCodes.CREATED).success(result);
};

export const handleAddMission = async (req, res, next) => {
  console.log("[POST] /stores/:storeId/missions hit", req.params, req.body);
  const storeId = Number(req.params.storeId);
  const mission = bodyToMission(req.body);
  const result = await addMissionToStore({ storeId, mission });
  res.status(StatusCodes.CREATED).success(result);
};
