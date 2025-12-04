// src/services/user.service.js
// 👤 유저 관련 비즈니스 로직(서비스 계층)

import { responseFromUser } from "../dtos/user.dtos.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

/**
 * 회원가입 서비스
 * 1. 이메일 중복 체크 + 유저 생성 (addUser)
 * 2. 선호 카테고리 매핑 생성 (UserFavorCategory)
 * 3. 가입된 유저 정보 + 선호 카테고리 조회 후 DTO 변환
 */
export const userSignUp = async (data) => {
  // 레포지토리 계층에 실제 DB 작업 위임
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    nickname: data.name, // nickname은 name과 동일하게 설정
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  // 이메일 중복일 경우 addUser에서 null 리턴
  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  // 선호 카테고리 저장 (UserFavorCategory 테이블에 insert)
  //   data.preferences: [1, 2, 3] 처럼 FoodCategory id 배열이라고 가정
  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  // 가입된 유저 정보 + 조인된 선호 카테고리 조회
  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  // 클라이언트 응답 형태로 변환
  return responseFromUser({ user, preferences });
};
