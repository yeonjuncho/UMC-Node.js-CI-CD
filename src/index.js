import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
<<<<<<< Updated upstream
import { handleUserSignUp } from "./controllers/user.controllers.js";
=======
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import passport from "passport";
import { handleUserSignUp, handleUserUpdate } from "./controllers/user.controllers.js";
>>>>>>> Stashed changes
import { handleAddReview, handleAddMission } from "./controllers/store.controller.js";
import {
  handleChallengeMission,
  handleListStoreMissions,
  handleListOngoingMissions,
} from "./controllers/mission.controller.js";
import { handleListStoreReviews, handleListMyReviews } from "./controllers/review.controller.js";
import { seedFoodCategories } from "./utils/seedFoodCategories.js";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
const port = process.env.PORT ?? 3000;

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

/**
 * async 함수 에러 처리를 위한 래퍼 함수
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// (1) 공통 미들웨어
app.use(cors()); // cors 방식 허용
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// Passport 설정
app.use(passport.initialize());

// (2) 요청 로깅(선택)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 인증 미들웨어
const isLogin = passport.authenticate('jwt', { session: false });

// (3) 라우트
app.get("/", (req, res) => {
  res.send(`
    <h1>메인 페이지</h1>
    <p>이 페이지는 로그인이 필요 없습니다.</p>
    <ul>
      <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
    </ul>
  `);
});

app.get("/login", (req, res) => {
  res.send(
    "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>"
  );
});

// Google OAuth 로그인
app.get(
  "/oauth2/login/google",
  passport.authenticate("google", {
    session: false,
  })
);

// Google OAuth 콜백
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user;
    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
        message: "Google 로그인 성공!",
        tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      },
    });
  }
);

app.get("/mypage", isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});

app.get("/set-login", (req, res) => {
  res.cookie("username", "UMC9th", { maxAge: 3600000 });
  res.send(
    '로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>'
  );
});

app.get("/set-logout", (req, res) => {
  res.clearCookie("username");
  res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});

<<<<<<< Updated upstream
// 회원가입
app.post("/api/v1/users/signup", asyncHandler(handleUserSignUp));

// 실습 엔드포인트
app.post("/api/v1/stores/:storeId/reviews", asyncHandler(handleAddReview));
app.post("/api/v1/stores/:storeId/missions", asyncHandler(handleAddMission));
app.post("/api/v1/missions/:missionId/challenge", asyncHandler(handleChallengeMission));
=======
app.post(
  "/api/v1/users/signup",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '회원 가입 API'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "name", "gender", "birth", "phoneNumber", "preferences"],
            properties: {
              email: { type: "string", example: "test@example.com" },
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "M" },
              birth: { type: "string", format: "date", example: "2000-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              detailAddress: { type: "string", example: "테헤란로 123" },
              phoneNumber: { type: "string", example: "010-1234-5678" },
              preferences: { type: "array", items: { type: "number" }, example: [1, 2, 3] }
            },
            example: {
              email: "test@example.com",
              name: "홍길동",
              gender: "M",
              birth: "2000-01-01",
              address: "서울시 강남구",
              detailAddress: "테헤란로 123",
              phoneNumber: "010-1234-5678",
              preferences: [1, 2, 3]
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공",
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
      description: "회원 가입 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
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
  asyncHandler(handleUserSignUp)
);

// 사용자 정보 수정
/*
  #swagger.tags = ['Users']
  #swagger.summary = '사용자 정보 수정 API'
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
    description: "사용자 정보 수정 성공",
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
    description: "사용자 정보 수정 실패",
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
app.patch("/api/v1/users/:userId", isLogin, asyncHandler(handleUserUpdate));

// 실습 엔드포인트
/*
  #swagger.tags = ['Reviews']
  #swagger.summary = '리뷰 추가 API'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["score"],
          properties: {
            score: { type: "number", description: "리뷰 점수 (1~5)", example: 5 },
            body: { type: "string", description: "리뷰 내용", example: "맛있어요!" },
            images: { type: "array", items: { type: "string" }, description: "리뷰 이미지 URL 배열", example: ["https://example.com/image1.jpg"] }
          },
          example: {
            score: 5,
            body: "맛있어요!",
            images: ["https://example.com/image1.jpg"]
          }
        }
      }
    }
  };
  #swagger.responses[201] = {
    description: "리뷰 추가 성공",
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
                reviewId: { type: "number" }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "리뷰 추가 실패",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "R001" },
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
  #swagger.responses[404] = {
    description: "매장을 찾을 수 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "S001" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            }
          }
        }
      }
    }
  };
*/
app.post("/api/v1/stores/:storeId/reviews", isLogin, asyncHandler(handleAddReview));
/*
  #swagger.tags = ['Missions']
  #swagger.summary = '미션 추가 API'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["title", "rewardPoint"],
          properties: {
            title: { type: "string", description: "미션 제목", example: "12000원 이상 주문하기" },
            rewardPoint: { type: "number", description: "보상 포인트", example: 500 },
            minPrice: { type: "number", nullable: true, description: "최소 금액 (선택)", example: 12000 }
          },
          example: {
            title: "12000원 이상 주문하기",
            rewardPoint: 500,
            minPrice: 12000
          }
        }
      }
    }
  };
  #swagger.responses[201] = {
    description: "미션 추가 성공",
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
                missionId: { type: "number" }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "미션 정보가 올바르지 않음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "C001" },
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
  #swagger.responses[404] = {
    description: "매장을 찾을 수 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "S001" },
                reason: { type: "string" }
              }
            }
          }
        }
      }
    }
  };
*/
app.post("/api/v1/stores/:storeId/missions", isLogin, asyncHandler(handleAddMission));
/*
  #swagger.tags = ['Missions']
  #swagger.summary = '미션 도전 API'
  #swagger.responses[201] = {
    description: "미션 도전 성공",
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
                memberMissionId: { type: "number" }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "요청이 올바르지 않음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "C001" },
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
  #swagger.responses[404] = {
    description: "미션을 찾을 수 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "M001" },
                reason: { type: "string" }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[409] = {
    description: "이미 도전 중인 미션",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "M002" },
                reason: { type: "string" }
              }
            }
          }
        }
      }
    }
  };
*/
app.post("/api/v1/missions/:missionId/challenge", isLogin, asyncHandler(handleChallengeMission));
>>>>>>> Stashed changes

// 미션/리뷰 조회 API
app.get("/api/v1/stores/:storeId/missions", asyncHandler(handleListStoreMissions));
app.get("/api/v1/stores/:storeId/reviews", asyncHandler(handleListStoreReviews));
<<<<<<< Updated upstream
app.get("/api/v1/users/:userId/reviews", asyncHandler(handleListMyReviews));
app.get("/api/v1/users/:userId/missions/ongoing", asyncHandler(handleListOngoingMissions));
=======
/*
  #swagger.tags = ['Reviews']
  #swagger.summary = '내가 작성한 리뷰 목록 조회 API'
  #swagger.parameters['cursor'] = {
    in: 'query',
    type: 'number',
    description: '페이징 커서 (선택)'
  };
  #swagger.parameters['take'] = {
    in: 'query',
    type: 'number',
    description: '가져올 개수 (1~50, 기본값: 5)'
  };
  #swagger.responses[200] = {
    description: "내가 작성한 리뷰 목록 조회 성공",
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
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      content: { type: "string" },
                      rating: { type: "number" },
                      store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                      user: { type: "object", properties: { id: { type: "number" }, nickname: { type: "string" } } },
                      images: { type: "array", items: { type: "string" } },
                      createdAt: { type: "string", format: "date-time" }
                    }
                  }
                },
                nextCursor: { type: "number", nullable: true }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "요청이 올바르지 않음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "C001" },
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
app.get("/api/v1/users/:userId/reviews", isLogin, asyncHandler(handleListMyReviews));
/*
  #swagger.tags = ['Missions']
  #swagger.summary = '진행 중인 미션 목록 조회 API'
  #swagger.responses[200] = {
    description: "진행 중인 미션 목록 조회 성공",
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
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      status: { type: "string" },
                      startedAt: { type: "string", format: "date-time" },
                      mission: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          title: { type: "string" },
                          rewardPoint: { type: "number" },
                          minPrice: { type: "number", nullable: true }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "요청이 올바르지 않음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "C001" },
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
app.get("/api/v1/users/:userId/missions/ongoing", isLogin, asyncHandler(handleListOngoingMissions));
>>>>>>> Stashed changes

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || err.status || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

// (5) 서버 시작
app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  // FoodCategory 시드 데이터 초기화
  await seedFoodCategories();
});