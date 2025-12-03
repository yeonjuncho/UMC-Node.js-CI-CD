/*
  Warnings:

  - You are about to drop the `reviewimage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reviewimage` DROP FOREIGN KEY `ReviewImage_reviewId_fkey`;

-- DropTable
DROP TABLE `reviewimage`;

-- CreateTable
CREATE TABLE `review_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reviewId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `review_image` ADD CONSTRAINT `review_image_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
