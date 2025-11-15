import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { handleUserSignUp } from "./controllers/user.controllers.js";
import { handleAddReview, handleAddMission } from "./controllers/store.controller.js";
import {
  handleChallengeMission,
  handleListStoreMissions,
  handleListOngoingMissions,
} from "./controllers/mission.controller.js";
import { handleListStoreReviews, handleListMyReviews } from "./controllers/review.controller.js";
import { seedFoodCategories } from "./utils/seedFoodCategories.js";

dotenv.config();

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
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// (2) 요청 로깅(선택)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 인증 미들웨어
const isLogin = (req, res, next) => {
  // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
  const { username } = req.cookies;
  if (username) {
    console.log(`[인증 성공] ${username}님, 환영합니다.`);
    next();
  } else {
    console.log("[인증 실패] 로그인이 필요합니다.");
    res
      .status(401)
      .send(
        '<script>alert("로그인이 필요합니다!");location.href="/login";</script>'
      );
  }
};

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

app.get("/mypage", isLogin, (req, res) => {
  res.send(`
    <h1>마이페이지</h1>
    <p>환영합니다, ${req.cookies.username}님!</p>
    <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
  `);
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

// 회원가입
app.post("/api/v1/users/signup", asyncHandler(handleUserSignUp));

// 실습 엔드포인트
app.post("/api/v1/stores/:storeId/reviews", asyncHandler(handleAddReview));
app.post("/api/v1/stores/:storeId/missions", asyncHandler(handleAddMission));
app.post("/api/v1/missions/:missionId/challenge", asyncHandler(handleChallengeMission));

// 미션/리뷰 조회 API
app.get("/api/v1/stores/:storeId/missions", asyncHandler(handleListStoreMissions));
app.get("/api/v1/stores/:storeId/reviews", asyncHandler(handleListStoreReviews));
app.get("/api/v1/users/:userId/reviews", asyncHandler(handleListMyReviews));
app.get("/api/v1/users/:userId/missions/ongoing", asyncHandler(handleListOngoingMissions));

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