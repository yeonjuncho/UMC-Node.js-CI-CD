import {
  StoreNotFoundError,
  InvalidReviewScoreError,
  InvalidRequestError,
} from "../errors.js";
import { existsStore, createMission, createReviewWithImages } from "../repositories/store.repository.js";

export const addReviewToStore = async ({ storeId, review, memberId }) => {
  if (!(await existsStore(storeId))) {
    throw new StoreNotFoundError("매장을 찾을 수 없습니다.", { storeId });
  }

  if (!memberId) {
    throw new InvalidRequestError("회원 정보를 찾을 수 없습니다.", null);
  }

  // score 기본 검증
  if (Number.isNaN(review.score) || review.score < 1 || review.score > 5) {
    throw new InvalidReviewScoreError("리뷰 점수는 1~5 사이의 값이어야 합니다.", { score: review.score });
  }

  const reviewId = await createReviewWithImages({
    memberId,
    storeId,
    score: review.score,
    text: review.text,
    images: review.images,
  });

  return { reviewId };
};

export const addMissionToStore = async ({ storeId, mission }) => {
  if (!(await existsStore(storeId))) {
    throw new StoreNotFoundError("매장을 찾을 수 없습니다.", { storeId });
  }

  if (!mission.title || Number.isNaN(mission.rewardPoint)) {
    throw new InvalidRequestError("미션 정보가 올바르지 않습니다. (title과 rewardPoint는 필수입니다)", { mission });
  }

  const missionId = await createMission({
    storeId,
    title: mission.title,
    rewardPoint: mission.rewardPoint,
    minPrice: mission.minPrice,
  });

  return { missionId };
};
