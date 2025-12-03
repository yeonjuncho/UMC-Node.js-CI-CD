# Postman 테스트 가이드

## 기본 설정

### 1. 서버 실행
```bash
npm run dev
```
서버가 `http://localhost:3000`에서 실행됩니다.

### 2. Postman 설정
- Base URL: `http://localhost:3000`
- Headers: `Content-Type: application/json`

---

## 1. 회원가입 API

### 요청
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/users/signup`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
```json
{
  "email": "test@example.com",
  "name": "홍길동",
  "gender": "남성",
  "birth": "2000-01-01",
  "address": "서울시 강남구",
  "detailAddress": "역삼동 123",
  "phoneNumber": "010-1234-5678",
  "preferences": [1, 2, 3]
}
```

### 성공 응답 (200 OK)
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "email": "test@example.com",
    "name": "홍길동",
    "preferCategory": ["한식", "중식", "일식"]
  }
}
```

### 실패 응답 - 중복 이메일 (409 Conflict)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "U001",
    "reason": "이미 존재하는 이메일입니다.",
    "data": {
      "email": "test@example.com",
      "name": "홍길동",
      ...
    }
  },
  "success": null
}
```

---

## 2. 리뷰 추가 API

### 요청
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/stores/1/reviews`
- **Body**:
```json
{
  "score": 5,
  "body": "정말 맛있어요! 서비스도 친절합니다.",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

### 성공 응답 (201 Created)
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "reviewId": 1
  }
}
```

### 실패 응답 - 매장 없음 (404 Not Found)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "S001",
    "reason": "매장을 찾을 수 없습니다.",
    "data": {
      "storeId": 999
    }
  },
  "success": null
}
```

### 실패 응답 - 잘못된 점수 (400 Bad Request)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "R001",
    "reason": "리뷰 점수는 1~5 사이의 값이어야 합니다.",
    "data": {
      "score": 10
    }
  },
  "success": null
}
```

---

## 3. 미션 추가 API

### 요청
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/stores/1/missions`
- **Body**:
```json
{
  "reward": 5000,
  "deadline": "2024-12-31T23:59:59Z",
  "missionSpec": "12000원 이상 식사 시 5000원 적립"
}
```

### 성공 응답 (201 Created)
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "missionId": 1
  }
}
```

### 실패 응답 - 매장 없음 (404 Not Found)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "S001",
    "reason": "매장을 찾을 수 없습니다.",
    "data": {
      "storeId": 999
    }
  },
  "success": null
}
```

### 실패 응답 - 잘못된 미션 정보 (400 Bad Request)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "C001",
    "reason": "미션 정보가 올바르지 않습니다.",
    "data": {
      "mission": {
        "reward": null,
        "deadline": null,
        "missionSpec": null
      }
    }
  },
  "success": null
}
```

---

## 4. 미션 도전 API

### 요청
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/missions/1/challenge`

### 성공 응답 (201 Created)
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "memberMissionId": 1
  }
}
```

### 실패 응답 - 미션 없음 (404 Not Found)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "M001",
    "reason": "미션을 찾을 수 없습니다.",
    "data": {
      "missionId": 999
    }
  },
  "success": null
}
```

### 실패 응답 - 이미 도전 중 (409 Conflict)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "M002",
    "reason": "이미 도전 중인 미션입니다.",
    "data": {
      "memberId": 1,
      "missionId": 1
    }
  },
  "success": null
}
```

### 실패 응답 - 잘못된 missionId (400 Bad Request)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "C001",
    "reason": "유효하지 않은 missionId입니다.",
    "data": {
      "missionId": -1
    }
  },
  "success": null
}
```

---

## 5. 매장 미션 목록 조회 API

### 요청
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/stores/1/missions`

### 성공 응답 (200 OK)
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "items": [
      {
        "id": 1,
        "title": "12000원 이상 식사",
        "rewardPoint": 5000,
        "minPrice": 12000
      },
      {
        "id": 2,
        "title": "리뷰 작성",
        "rewardPoint": 1000,
        "minPrice": null
      }
    ]
  }
}
```

### 실패 응답 - 잘못된 storeId (400 Bad Request)
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "C001",
    "reason": "유효하지 않은 storeId입니다.",
    "data": {
      "storeId": 0
    }
  },
  "success": null
}
```

---

## 6. 매장 리뷰 목록 조회 API

### 요청
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/stores/1/reviews?take=5`
- **Query Parameters** (선택):
  - `cursor`: 다음 페이지 커서 (숫자)
  - `take`: 가져올 개수 (1~50, 기본값: 5)

### 예시
- 첫 페이지: `http://localhost:3000/api/v1/stores/1/reviews?take=5`
- 다음 페이지: `http://localhost:3000/api/v1/stores/1/reviews?cursor=10&take=5`

### 성공 응답 (200 OK)
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "items": [
      {
        "id": 1,
        "content": "정말 맛있어요!",
        "rating": 5,
        "store": {
          "id": 1,
          "name": "맛있는 식당"
        },
        "user": {
          "id": 1,
          "nickname": "홍길동"
        },
        "images": [
          "https://example.com/image1.jpg"
        ],
        "createdAt": "2024-11-15T09:00:00.000Z"
      }
    ],
    "nextCursor": 5
  }
}
```

---

## 7. 내 리뷰 목록 조회 API

### 요청
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/users/1/reviews?take=5`
- **Query Parameters** (선택):
  - `cursor`: 다음 페이지 커서 (숫자)
  - `take`: 가져올 개수 (1~50, 기본값: 5)

### 성공 응답 (200 OK)
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "items": [
      {
        "id": 1,
        "content": "정말 맛있어요!",
        "rating": 5,
        "store": {
          "id": 1,
          "name": "맛있는 식당"
        },
        "user": {
          "id": 1,
          "nickname": "홍길동"
        },
        "images": [],
        "createdAt": "2024-11-15T09:00:00.000Z"
      }
    ],
    "nextCursor": null
  }
}
```

---

## 8. 진행 중인 미션 목록 조회 API

### 요청
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/users/1/missions/ongoing`

### 성공 응답 (200 OK)
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "items": [
      {
        "id": 1,
        "status": "ONGOING",
        "startedAt": "2024-11-15T09:00:00.000Z",
        "mission": {
          "id": 1,
          "title": "12000원 이상 식사",
          "rewardPoint": 5000
        }
      }
    ]
  }
}
```

---

## 테스트 순서 추천

1. **회원가입** → `userId` 확인 (예: 1)
2. **매장 생성** (직접 DB에 추가하거나 기존 매장 ID 사용)
3. **미션 추가** → `missionId` 확인 (예: 1)
4. **리뷰 추가** → `reviewId` 확인
5. **미션 도전**
6. **목록 조회** (매장 미션, 리뷰, 진행 중인 미션)

---

## FoodCategory ID 참고

기본 카테고리 ID (회원가입 시 `preferences` 배열에 사용):
- 1: 한식
- 2: 중식
- 3: 일식
- 4: 양식
- 5: 분식
- 6: 치킨
- 7: 피자
- 8: 패스트푸드
- 9: 카페
- 10: 디저트

---

## 에러 코드 참고

- **U001**: 중복 이메일 (409)
- **U002**: 회원 정보 없음 (400)
- **S001**: 매장 없음 (404)
- **R001**: 리뷰 점수 오류 (400)
- **M001**: 미션 없음 (404)
- **M002**: 이미 도전 중인 미션 (409)
- **C001**: 잘못된 요청 (400)

