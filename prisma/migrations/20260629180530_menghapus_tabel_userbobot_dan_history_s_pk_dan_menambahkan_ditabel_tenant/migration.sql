/*
  Warnings:

  - You are about to drop the `historyspk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userbobot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `historyspk` DROP FOREIGN KEY `HistorySPK_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userbobot` DROP FOREIGN KEY `UserBobot_kategoriId_fkey`;

-- DropForeignKey
ALTER TABLE `userbobot` DROP FOREIGN KEY `UserBobot_userId_fkey`;

-- AlterTable
ALTER TABLE `tenant` ADD COLUMN `ratingMaps` DOUBLE NULL;

-- DropTable
DROP TABLE `historyspk`;

-- DropTable
DROP TABLE `userbobot`;
