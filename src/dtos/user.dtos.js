// src/dtos/user.dtos.js
// 🙋‍♀️ 요청/응답 DTO 변환 전담 파일

/**
 * 회원가입 요청 바디를 서비스 계층에서 쓰기 좋은 형태로 변환
 * - 타입 변환 (birth → Date)
 * - 선택/필수 필드 정리
 */
export const bodyToUser = (body) => {
  // 클라이언트에서 "2000-01-01" 같은 문자열로 올 것을 가정하고 Date로 변환
  const birth = new Date(body.birth);

  return {
    // 필수 값
    email: body.email,
    name: body.name,
    gender: body.gender,
    birth,

    // 선택 값 (안 들어오면 기본값 사용)
    address: body.address || "",
    detailAddress: body.detailAddress || "",

    // 필수지만 빈 문자열이 올 수도 있는 값
    phoneNumber: body.phoneNumber,

    // 선호 카테고리 (FoodCategory id 배열)
    preferences: body.preferences,
  };
};

/**
 * 서비스/레포지토리에서 가져온 User + 선호 카테고리 목록을
 * 클라이언트에 내려줄 응답 형태로 변환
 */
export const responseFromUser = ({ user, preferences }) => {
  // join된 UserFavorCategory → FoodCategory.name 배열로 변환
  const preferFoods = preferences.map(
    (preference) => preference.foodCategory.name
  );

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
};
