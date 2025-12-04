// src/controllers/user.controllers.js
// 🌐 HTTP 요청/응답 담당 (Controller 계층)

import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dtos.js";
import { userSignUp } from "../services/user.service.js";

/**
 * POST /api/v1/users/signup
 * 회원가입 컨트롤러
 * - body 검증/변환은 DTO에서
 * - 비즈니스 로직은 service에서 처리
 */
export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인용 로그

  // HTTP body → 서비스에서 쓰기 좋은 DTO로 변환
  const userDto = bodyToUser(req.body);

  // 실제 회원가입 비즈니스 로직 수행
  const user = await userSignUp(userDto);

  // 공통 응답 헬퍼를 사용해서 응답
  res.status(StatusCodes.OK).success(user);
};
