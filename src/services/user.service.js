import { responseFromUser } from "../dtos/user.dtos.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
<<<<<<< Updated upstream
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    nickname: data.name, // nickname은 name과 동일하게 설정
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
=======
  // 트랜잭션으로 회원가입과 선호 카테고리 설정을 원자적으로 처리
  const result = await prisma.$transaction(async (tx) => {
    // 이메일 중복 확인
    const existingUser = await tx.user.findFirst({ where: { email: data.email } });
    
    let joinUserId;
    
    if (existingUser) {
      // 이미 존재하는 사용자인 경우 정보 업데이트
      joinUserId = existingUser.id;
      
      await tx.user.update({
        where: { id: joinUserId },
        data: {
          name: data.name,
          nickname: data.name, // nickname은 name과 동일하게 설정
          gender: data.gender,
          birth: data.birth,
          address: data.address,
          detailAddress: data.detailAddress,
          phoneNumber: data.phoneNumber,
        },
      });
      
      // 기존 선호 카테고리 삭제
      await tx.userFavorCategory.deleteMany({
        where: { userId: joinUserId },
      });
    } else {
      // 새 사용자 생성
      const created = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          nickname: data.name, // nickname은 name과 동일하게 설정
          gender: data.gender,
          birth: data.birth,
          address: data.address,
          detailAddress: data.detailAddress,
          phoneNumber: data.phoneNumber,
        },
      });

      joinUserId = created.id;
    }

    // 선호 카테고리 설정
    for (const preference of data.preferences) {
      await tx.userFavorCategory.create({
        data: {
          userId: joinUserId,
          foodCategoryId: preference,
        },
      });
    }

    return joinUserId;
>>>>>>> Stashed changes
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};