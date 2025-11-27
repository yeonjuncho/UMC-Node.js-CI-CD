import { StatusCodes } from "http-status-codes";
import { InvalidRequestError } from "../errors.js";
import { listMyReviews, listStoreReviews } from "../services/review.service.js";

export const handleListStoreReviews = async (req, res, next) => {
  const storeId = Number(req.params.storeId);
  if (!Number.isInteger(storeId) || storeId <= 0) {
    throw new InvalidRequestError("유효하지 않은 storeId입니다.", { storeId });
  }

  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
  const take = req.query.take ? Math.min(Math.max(Number(req.query.take), 1), 50) : 5;

  const result = await listStoreReviews({ storeId, cursor, take });
  res.status(StatusCodes.OK).success(result);
};

export const handleListMyReviews = async (req, res, next) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new InvalidRequestError("유효하지 않은 userId입니다.", { userId });
  }

  // 본인만 조회 가능하도록 권한 검증
  if (req.user.id !== userId) {
    throw new InvalidRequestError("본인의 리뷰만 조회할 수 있습니다.", { userId, currentUserId: req.user.id });
  }

  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
  const take = req.query.take ? Math.min(Math.max(Number(req.query.take), 1), 50) : 5;

  const result = await listMyReviews({ userId, cursor, take });
  res.status(StatusCodes.OK).success(result);
};