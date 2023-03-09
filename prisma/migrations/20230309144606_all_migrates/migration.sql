-- CreateTable
CREATE TABLE `Orders` (
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

    UNIQUE INDEX `Orders_clientOrderId_key`(`clientOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Automations` (
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

    UNIQUE INDEX `Automations_name_key`(`name`),
    UNIQUE INDEX `Automations_symbol_key`(`symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withdrawTemplates` (
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

    UNIQUE INDEX `withdrawTemplates_name_key`(`name`),
    UNIQUE INDEX `withdrawTemplates_coin_key`(`coin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderTemplates` (
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

    UNIQUE INDEX `OrderTemplates_name_key`(`name`),
    UNIQUE INDEX `OrderTemplates_symbol_key`(`symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actions` (
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
CREATE TABLE `Grids` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `automationId` INTEGER NOT NULL,
    `orderTemplateId` INTEGER NOT NULL,
    `conditions` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Monitors` (
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

    UNIQUE INDEX `Monitors_symbol_key`(`symbol`),
    UNIQUE INDEX `Monitors_type_key`(`type`),
    UNIQUE INDEX `Monitors_interval_key`(`interval`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_automationId_fkey` FOREIGN KEY (`automationId`) REFERENCES `Automations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_orderTemplateId_fkey` FOREIGN KEY (`orderTemplateId`) REFERENCES `OrderTemplates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_withdrawTemplateId_fkey` FOREIGN KEY (`withdrawTemplateId`) REFERENCES `withdrawTemplates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_automationId_fkey` FOREIGN KEY (`automationId`) REFERENCES `Automations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grids` ADD CONSTRAINT `Grids_automationId_fkey` FOREIGN KEY (`automationId`) REFERENCES `Automations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grids` ADD CONSTRAINT `Grids_orderTemplateId_fkey` FOREIGN KEY (`orderTemplateId`) REFERENCES `OrderTemplates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
