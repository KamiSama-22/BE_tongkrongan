-- CreateTable
CREATE TABLE `Fasilitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `poin` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Fasilitas_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TenantFasilitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `fasilitasId` INTEGER NOT NULL,

    UNIQUE INDEX `TenantFasilitas_tenantId_fasilitasId_key`(`tenantId`, `fasilitasId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TenantFasilitas` ADD CONSTRAINT `TenantFasilitas_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TenantFasilitas` ADD CONSTRAINT `TenantFasilitas_fasilitasId_fkey` FOREIGN KEY (`fasilitasId`) REFERENCES `Fasilitas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
