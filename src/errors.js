import { StatusCodes } from "http-status-codes";

// ========== User 관련 오류 ==========
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  statusCode = StatusCodes.CONFLICT; // 409 Conflict
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoMemberError extends Error {
  errorCode = "U002";
  statusCode = StatusCodes.BAD_REQUEST; // 400 Bad Request
  constructor(reason = "회원 정보를 찾을 수 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// ========== Store 관련 오류 ==========
export class StoreNotFoundError extends Error {
  errorCode = "S001";
  statusCode = StatusCodes.NOT_FOUND; // 404 Not Found
  constructor(reason = "매장을 찾을 수 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// ========== Review 관련 오류 ==========
export class InvalidReviewScoreError extends Error {
  errorCode = "R001";
  statusCode = StatusCodes.BAD_REQUEST; // 400 Bad Request
  constructor(reason = "리뷰 점수는 1~5 사이의 값이어야 합니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// ========== Mission 관련 오류 ==========
export class MissionNotFoundError extends Error {
  errorCode = "M001";
  statusCode = StatusCodes.NOT_FOUND; // 404 Not Found
  constructor(reason = "미션을 찾을 수 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class AlreadyChallengedError extends Error {
  errorCode = "M002";
  statusCode = StatusCodes.CONFLICT; // 409 Conflict
  constructor(reason = "이미 도전 중인 미션입니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// ========== 공통 오류 ==========
export class InvalidRequestError extends Error {
  errorCode = "C001";
  statusCode = StatusCodes.BAD_REQUEST; // 400 Bad Request
  constructor(reason = "잘못된 요청입니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

