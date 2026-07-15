/*
  Warnings:

  - You are about to drop the column `gambar` on the `galeri` table. All the data in the column will be lost.
  - Added the required column `tipe` to the `Galeri` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Galeri` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `galeri` DROP FOREIGN KEY `Galeri_tenantId_fkey`;

-- AlterTable
ALTER TABLE `galeri` DROP COLUMN `gambar`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `tipe` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL,
    MODIFY `tenantId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Galeri` ADD CONSTRAINT `Galeri_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
