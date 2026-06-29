/*
  Warnings:

  - You are about to drop the column `skor` on the `subkategori` table. All the data in the column will be lost.
  - Added the required column `keterangan` to the `SubKategori` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nilai` to the `SubKategori` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subkategori` DROP COLUMN `skor`,
    ADD COLUMN `keterangan` VARCHAR(191) NOT NULL,
    ADD COLUMN `nilai` INTEGER NOT NULL;
