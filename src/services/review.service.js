import { getAllStoreReviews, getUserReviews } from "../repositories/review.repository.js";
import { responseFromReviews } from "../dtos/review.dto.js";

export const listStoreReviews = async ({ storeId, cursor, take = 5 }) => {
  const rows = await getAllStoreReviews({ storeId, cursor, take });
  return responseFromReviews(rows, take);
};

export const listMyReviews = async ({ userId, cursor, take = 5 }) => {
  const rows = await getUserReviews({ userId, cursor, take });
  return responseFromReviews(rows, take);
};