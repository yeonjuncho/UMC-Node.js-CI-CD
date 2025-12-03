export const bodyToReview = (body) => ({
  score: Number(body.score),
  text: body.body ?? null,
  images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
});

export const bodyToMission = (body) => ({
  title: body.title || body.missionSpec, // missionSpec을 title로 사용 (하위 호환)
  rewardPoint: Number(body.rewardPoint || body.reward),
  minPrice: body.minPrice ? Number(body.minPrice) : null,
});
