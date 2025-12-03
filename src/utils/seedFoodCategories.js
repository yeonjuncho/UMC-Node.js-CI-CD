import { prisma } from "../db.config.js";

const foodCategories = [
  "한식",
  "중식",
  "일식",
  "양식",
  "분식",
  "치킨",
  "피자",
  "패스트푸드",
  "카페",
  "디저트",
];

/**
 * FoodCategory 시드 데이터 초기화
 * 서버 시작 시 호출하여 기본 카테고리 데이터를 추가합니다.
 */
export const seedFoodCategories = async () => {
  try {
    // 이미 데이터가 있는지 확인
    const existingCount = await prisma.foodCategory.count();
    
    if (existingCount === 0) {
      console.log("🌱 FoodCategory 시드 데이터를 추가합니다...");
      
      // 데이터 추가
      for (const name of foodCategories) {
        await prisma.foodCategory.create({
          data: { name },
        });
      }
      
      console.log(`✅ ${foodCategories.length}개의 FoodCategory가 추가되었습니다.`);
    } else {
      console.log(`ℹ️ FoodCategory 데이터가 이미 존재합니다. (${existingCount}개)`);
    }
  } catch (error) {
    console.error("❌ FoodCategory 시드 데이터 추가 중 오류 발생:", error);
    // 오류가 발생해도 서버는 계속 실행되도록 함
  }
};

