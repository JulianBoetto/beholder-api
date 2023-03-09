-- CreateTable
CREATE TABLE `Symbols` (
    `symbol` VARCHAR(191) NOT NULL,
    `basePrecision` INTEGER NOT NULL,
    `quotePrecision` INTEGER NOT NULL,
    `minNotional` VARCHAR(191) NOT NULL,
    `minLotSize` VARCHAR(191) NOT NULL,
    `isFavorite` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Symbols_symbol_key`(`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
