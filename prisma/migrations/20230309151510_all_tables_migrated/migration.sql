-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `apiUrl` VARCHAR(191) NOT NULL,
    `accessKey` VARCHAR(191) NOT NULL,
    `secretKey` VARCHAR(191) NOT NULL,
    `streamUrl` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `sendGridKey` VARCHAR(191) NOT NULL,
    `twilioSid` VARCHAR(191) NOT NULL,
    `twilioToken` VARCHAR(191) NOT NULL,
    `twilioPhone` VARCHAR(191) NOT NULL,
    `telegramBot` VARCHAR(191) NOT NULL,
    `telegramChat` VARCHAR(191) NOT NULL,
    `pushToken` VARCHAR(191) NOT NULL,
    `refreshToken` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Symbol` (
    `symbol` VARCHAR(191) NOT NULL,
    `basePrecision` INTEGER NOT NULL,
    `quotePrecision` INTEGER NOT NULL,
    `minNotional` VARCHAR(191) NOT NULL,
    `minLotSize` VARCHAR(191) NOT NULL,
    `isFavorite` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Symbol_symbol_key`(`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `automationId` INTEGER NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `orderId` BIGINT NOT NULL,
    `clientOrderId` VARCHAR(191) NOT NULL,
    `transactTime` BIGINT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `side` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `isMaker` BOOLEAN NOT NULL,
    `limitPrice` VARCHAR(191) NOT NULL,
    `stopPrice` VARCHAR(191) NOT NULL,
    `avgPrice` DECIMAL(18, 8) NOT NULL,
    `commission` VARCHAR(191) NOT NULL,
    `net` DECIMAL(18, 8) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `icebergQty` VARCHAR(191) NOT NULL,
    `obs` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_clientOrderId_key`(`clientOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Automation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `indexes` VARCHAR(191) NOT NULL,
    `conditions` VARCHAR(191) NOT NULL,
    `schedule` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `logs` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Automation_name_key`(`name`),
    UNIQUE INDEX `Automation_symbol_key`(`symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withdrawTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `coin` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `amountMultiplier` DECIMAL(10, 2) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `addressTag` VARCHAR(191) NOT NULL,
    `network` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `withdrawTemplate_name_key`(`name`),
    UNIQUE INDEX `withdrawTemplate_coin_key`(`coin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `side` VARCHAR(191) NOT NULL,
    `limitPrice` VARCHAR(191) NOT NULL,
    `limitPriceMultiplier` DECIMAL(10, 2) NOT NULL,
    `stopPrice` VARCHAR(191) NOT NULL,
    `stopPriceMultiplier` DECIMAL(10, 2) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `quantityMultiplier` DECIMAL(10, 2) NOT NULL,
    `icebergQty` VARCHAR(191) NOT NULL,
    `icebergQtyMultiplier` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OrderTemplate_name_key`(`name`),
    UNIQUE INDEX `OrderTemplate_symbol_key`(`symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `automationId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `orderTemplateId` INTEGER NOT NULL,
    `withdrawTemplateId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `automationId` INTEGER NOT NULL,
    `orderTemplateId` INTEGER NOT NULL,
    `conditions` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Monitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `symbol` VARCHAR(191) NOT NULL DEFAULT '*',
    `type` VARCHAR(191) NOT NULL,
    `broadcastLabel` VARCHAR(191) NOT NULL,
    `interval` VARCHAR(191) NOT NULL,
    `indexes` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `isSystemMon` BOOLEAN NOT NULL DEFAULT false,
    `logs` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Monitor_symbol_key`(`symbol`),
    UNIQUE INDEX `Monitor_type_key`(`type`),
    UNIQUE INDEX `Monitor_interval_key`(`interval`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_automationId_fkey` FOREIGN KEY (`automationId`) REFERENCES `Automation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_orderTemplateId_fkey` FOREIGN KEY (`orderTemplateId`) REFERENCES `OrderTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_withdrawTemplateId_fkey` FOREIGN KEY (`withdrawTemplateId`) REFERENCES `withdrawTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_automationId_fkey` FOREIGN KEY (`automationId`) REFERENCES `Automation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grid` ADD CONSTRAINT `Grid_automationId_fkey` FOREIGN KEY (`automationId`) REFERENCES `Automation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grid` ADD CONSTRAINT `Grid_orderTemplateId_fkey` FOREIGN KEY (`orderTemplateId`) REFERENCES `OrderTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
