/*
  Warnings:

  - Made the column `tenantId` on table `galeri` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `galeri` DROP FOREIGN KEY `Galeri_tenantId_fkey`;

-- AlterTable
ALTER TABLE `galeri` MODIFY `tenantId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Galeri` ADD CONSTRAINT `Galeri_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
