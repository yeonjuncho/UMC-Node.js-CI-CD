import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dtos.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));

  res.status(StatusCodes.OK).success(user);
<<<<<<< Updated upstream
=======
};

export const handleUserUpdate = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 정보 수정 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "M" },
              birth: { type: "string", format: "date", example: "2000-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              detailAddress: { type: "string", example: "테헤란로 123" },
              phoneNumber: { type: "string", example: "010-1234-5678" },
              nickname: { type: "string", example: "길동이" },
              preferences: { type: "array", items: { type: "number" }, example: [1, 2, 3] }
            },
            example: {
              name: "홍길동",
              phoneNumber: "010-1234-5678",
              preferences: [1, 2, 3]
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "사용자 정보 수정 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "사용자 정보 수정 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U002" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new InvalidRequestError("유효하지 않은 userId입니다.", { userId });
  }

  // 본인만 수정 가능하도록 권한 검증
  if (req.user.id !== userId) {
    throw new InvalidRequestError("본인의 정보만 수정할 수 있습니다.", { userId, currentUserId: req.user.id });
  }

  const user = await userUpdate(userId, bodyToUserUpdate(req.body));

  res.status(StatusCodes.OK).success(user);
>>>>>>> Stashed changes
};