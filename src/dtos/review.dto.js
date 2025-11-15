export const responseFromReviews = (rows = [], take = 5) => {
  // 다음 커서 확인을 위해 마지막 항목 제거
  const hasNext = rows.length > take;
  const items = hasNext ? rows.slice(0, -1) : rows;
  const nextCursor = hasNext ? rows[rows.length - 1].id : null;
  
  return {
    items: items.map((r) => ({
      id: r.id,
      content: r.content,
      rating: r.rating,
      store: r.store ? { id: r.store.id, name: r.store.name } : null,
      user: r.user
        ? {
            id: r.user.id,
            nickname: r.user.nickname,
          }
        : null,
      images: r.images || [],
      createdAt: r.createdAt,
    })),
    nextCursor,
  };
};