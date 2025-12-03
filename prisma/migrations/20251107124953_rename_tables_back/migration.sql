/*
  Warnings:

  - You are about to drop the `review_image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_mission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `review_image` DROP FOREIGN KEY `review_image_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `user_mission` DROP FOREIGN KEY `user_mission_missionId_fkey`;

-- DropForeignKey
ALTER TABLE `user_mission` DROP FOREIGN KEY `user_mission_userId_fkey`;

-- DropTable
DROP TABLE `review_image`;

-- DropTable
DROP TABLE `user_mission`;

-- CreateTable
CREATE TABLE `ReviewImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reviewId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `missionId` INTEGER NOT NULL,
    `status` ENUM('ONGOING', 'COMPLETED') NOT NULL DEFAULT 'ONGOING',
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    INDEX `UserMission_userId_status_idx`(`userId`, `status`),
    INDEX `UserMission_missionId_idx`(`missionId`),
    UNIQUE INDEX `UserMission_userId_missionId_key`(`userId`, `missionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReviewImage` ADD CONSTRAINT `ReviewImage_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMission` ADD CONSTRAINT `UserMission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMission` ADD CONSTRAINT `UserMission_missionId_fkey` FOREIGN KEY (`missionId`) REFERENCES `Mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
