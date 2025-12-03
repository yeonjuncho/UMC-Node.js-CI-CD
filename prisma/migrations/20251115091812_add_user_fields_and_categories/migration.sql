-- AlterTable: User 테이블에 필드 추가 (먼저 NULL 허용으로 추가)
ALTER TABLE `User` 
ADD COLUMN `email` VARCHAR(191) NULL,
ADD COLUMN `name` VARCHAR(191) NULL,
ADD COLUMN `gender` VARCHAR(191) NULL,
ADD COLUMN `birth` DATETIME(3) NULL,
ADD COLUMN `address` VARCHAR(191) NULL DEFAULT '',
ADD COLUMN `detailAddress` VARCHAR(191) NULL DEFAULT '',
ADD COLUMN `phoneNumber` VARCHAR(191) NULL;

-- 기존 데이터가 있다면 nickname을 name과 email에 복사 (기존 데이터 처리)
UPDATE `User` SET `name` = `nickname`, `email` = CONCAT(`nickname`, '@temp.com'), `gender` = '미정', `birth` = `createdAt`, `phoneNumber` = '' WHERE `email` IS NULL;

-- NOT NULL 제약 조건 추가 및 기본값 설정
ALTER TABLE `User` 
MODIFY COLUMN `email` VARCHAR(191) NOT NULL,
MODIFY COLUMN `name` VARCHAR(191) NOT NULL,
MODIFY COLUMN `gender` VARCHAR(191) NOT NULL,
MODIFY COLUMN `birth` DATETIME(3) NOT NULL,
MODIFY COLUMN `phoneNumber` VARCHAR(191) NOT NULL;

-- CreateIndex: email에 UNIQUE 제약 조건 추가
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- CreateTable
CREATE TABLE `FoodCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserFavorCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `foodCategoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserFavorCategory_userId_idx`(`userId`),
    INDEX `UserFavorCategory_foodCategoryId_idx`(`foodCategoryId`),
    UNIQUE INDEX `UserFavorCategory_userId_foodCategoryId_key`(`userId`, `foodCategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserFavorCategory` ADD CONSTRAINT `UserFavorCategory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFavorCategory` ADD CONSTRAINT `UserFavorCategory_foodCategoryId_fkey` FOREIGN KEY (`foodCategoryId`) REFERENCES `FoodCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert seed data into FoodCategory
INSERT INTO `FoodCategory` (`name`, `createdAt`) VALUES
('한식', NOW(3)),
('중식', NOW(3)),
('일식', NOW(3)),
('양식', NOW(3)),
('분식', NOW(3)),
('치킨', NOW(3)),
('피자', NOW(3)),
('패스트푸드', NOW(3)),
('카페', NOW(3)),
('디저트', NOW(3));

