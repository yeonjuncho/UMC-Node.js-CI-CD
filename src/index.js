// src/index.js
// 🚀 애플리케이션 엔트리 포인트 (서버 시작 파일)

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";

import { handleUserSignUp } from "./controllers/user.controllers.js";
import { handleAddReview, handleAddMission } from "./controllers/store.controller.js";
import {
  handleChallengeMission,
  handleListStoreMissions,
  handleListOngoingMissions,
} from "./controllers/mission.controller.js";
import { handleListStoreReviews, handleListMyReviews } from "./controllers/review.controller.js";
import { seedFoodCategories } from "./utils/seedFoodCategories.js";
import { googleStrategy, jwtStrategy } from "./auth.config.js";

dotenv.config(); // .env 로드

// Passport 전략 등록 (Google OAuth + JWT)
passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
const port = process.env.PORT ?? 3000;

/**
 * 🎁 공통 응답 헬퍼를 사용할 수 있게 res에 메서드 주입
 *  - res.success(data)
 *  - res.error({ errorCode, reason, data })
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
 * 🧯 async 함수 에러 처리를 위한 래퍼
 *  - 컨트롤러를 asyncHandler로 감싸서 try/catch 반복 제거
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// (1) 공통 미들웨어 등록
app.use(cors()); // CORS 허용
app.use(morgan("dev")); // 요청 로깅
app.use(cookieParser()); // 쿠키 파싱
app.use(express.static("public")); // 정적 파일 서빙
app.use(express.json()); // JSON body 파싱
app.use(express.urlencoded({ extended: false })); // form-urlencoded 파싱

// Passport 초기화 (세션은 사용하지 않음)
app.use(passport.initialize());

// (2) 추가 요청 로깅 (디버깅용 – 필요 없으면 지워도 됨)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// JWT 기반 인증 미들웨어
const isLogin = passport.authenticate("jwt", { session: false });

/* ====================================================================== */
/* 기본 페이지 (테스트용)                                                  */
/* ====================================================================== */

// 메인 페이지 (인증 불필요)
app.get("/", (req, res) => {
  res.send(`
    <h1>메인 페이지</h1>
    <p>이 페이지는 로그인이 필요 없습니다.</p>
    <ul>
      <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
      <li><a href="/oauth2/login/google">Google 로그인 테스트</a></li>
    </ul>
  `);
});

// 로그인 실패시 리다이렉트 되는 페이지 예시
app.get("/login", (req, res) => {
  res.send(
    "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>"
  );
});

/* ====================================================================== */
/* Google OAuth2 로그인                                                    */
/* ====================================================================== */

// Google OAuth 로그인 시작
//  - 사용자가 이 URL을 열면 Google 로그인 페이지로 이동
app.get(
  "/oauth2/login/google",
  passport.authenticate("google", {
    session: false,
  })
);

// Google OAuth 콜백
//  - Google에서 user 정보 + code를 가지고 이 주소로 리다이렉트
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // auth.config.js의 Google Strategy에서 넘겨준 값 (accessToken / refreshToken 등)
    const tokens = req.user;

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
        message: "Google 로그인 성공!",
        tokens, // { accessToken, refreshToken } 형태 예상
      },
    });
  }
);

// JWT 인증이 필요한 페이지 예시
app.get("/mypage", isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});

// 아래 두 개는 쿠키 기반 테스트용 (실제 JWT 인증과는 별도)
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

/* ====================================================================== */
/* Users API                                                               */
/* ====================================================================== */

/**
 * 회원가입 API
 * POST /api/v1/users/signup
 *
 * 아래처럼 Swagger용 주석도 그대로 남겨둘 수 있음.
 */
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
app.post("/api/v1/users/signup", asyncHandler(handleUserSignUp));

/* ====================================================================== */
/* Reviews & Missions API (로그인 필요)                                   */
/* ====================================================================== */

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
*/
app.post(
  "/api/v1/stores/:storeId/reviews",
  isLogin,
  asyncHandler(handleAddReview)
);

/*
  #swagger.tags = ['Missions']
  #swagger.summary = '미션 추가 API'
*/
app.post(
  "/api/v1/stores/:storeId/missions",
  isLogin,
  asyncHandler(handleAddMission)
);

/*
  #swagger.tags = ['Missions']
  #swagger.summary = '미션 도전 API'
*/
app.post(
  "/api/v1/missions/:missionId/challenge",
  isLogin,
  asyncHandler(handleChallengeMission)
);

/* ====================================================================== */
/* 조회용 API                                                              */
/* ====================================================================== */

// 특정 매장의 미션 목록
app.get(
  "/api/v1/stores/:storeId/missions",
  asyncHandler(handleListStoreMissions)
);

// 특정 매장의 리뷰 목록
app.get(
  "/api/v1/stores/:storeId/reviews",
  asyncHandler(handleListStoreReviews)
);

/*
  #swagger.tags = ['Reviews']
  #swagger.summary = '내가 작성한 리뷰 목록 조회 API'
*/
app.get(
  "/api/v1/users/:userId/reviews",
  isLogin,
  asyncHandler(handleListMyReviews)
);

/*
  #swagger.tags = ['Missions']
  #swagger.summary = '진행 중인 미션 목록 조회 API'
*/
app.get(
  "/api/v1/users/:userId/missions/ongoing",
  isLogin,
  asyncHandler(handleListOngoingMissions)
);

/* ====================================================================== */
/* 전역 에러 처리 미들웨어                                                */
/* ====================================================================== */

app.use((err, req, res, next) => {
  if (res.headersSent) {
    // 이미 응답이 나갔으면 Express 기본 에러 핸들러에게 넘김
    return next(err);
  }

  res.status(err.statusCode || err.status || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

/* ====================================================================== */
/* 서버 시작                                                               */
/* ====================================================================== */

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);

  // FoodCategory 시드 데이터 초기화
  await seedFoodCategories();
});
