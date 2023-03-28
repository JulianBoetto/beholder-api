-- DropForeignKey
ALTER TABLE `Action` DROP FOREIGN KEY `Action_orderTemplateId_fkey`;

-- DropForeignKey
ALTER TABLE `Action` DROP FOREIGN KEY `Action_withdrawTemplateId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_automationId_fkey`;

-- AlterTable
ALTER TABLE `Action` MODIFY `orderTemplateId` INTEGER NULL,
    MODIFY `withdrawTemplateId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Automation` MODIFY `schedule` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Monitor` MODIFY `broadcastLabel` VARCHAR(191) NULL,
    MODIFY `interval` VARCHAR(191) NULL,
    MODIFY `indexes` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `automationId` INTEGER NULL,
    MODIFY `orderId` BIGINT NOT NULL,
    MODIFY `isMaker` BOOLEAN NULL,
    MODIFY `limitPrice` VARCHAR(191) NULL,
    MODIFY `stopPrice` VARCHAR(191) NULL,
    MODIFY `avgPrice` DECIMAL(18, 8) NULL,
    MODIFY `commission` VARCHAR(191) NULL,
    MODIFY `net` DECIMAL(18, 8) NULL,
    MODIFY `icebergQty` VARCHAR(191) NULL,
    MODIFY `obs` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `OrderTemplate` MODIFY `limitPrice` VARCHAR(191) NULL,
    MODIFY `limitPriceMultiplier` DECIMAL(10, 2) NULL,
    MODIFY `stopPrice` VARCHAR(191) NULL,
    MODIFY `stopPriceMultiplier` DECIMAL(10, 2) NULL,
    MODIFY `quantityMultiplier` DECIMAL(10, 2) NULL,
    MODIFY `icebergQty` VARCHAR(191) NULL,
    MODIFY `icebergQtyMultiplier` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `Symbol` MODIFY `base` VARCHAR(191) NULL,
    MODIFY `quote` VARCHAR(191) NULL,
    MODIFY `stepSize` VARCHAR(191) NULL,
    MODIFY `tickSize` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `apiUrl` VARCHAR(191) NULL,
    MODIFY `accessKey` VARCHAR(191) NULL,
    MODIFY `secretKey` VARCHAR(191) NULL,
    MODIFY `streamUrl` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `sendGridKey` VARCHAR(191) NULL,
    MODIFY `twilioSid` VARCHAR(191) NULL,
    MODIFY `twilioToken` VARCHAR(191) NULL,
    MODIFY `twilioPhone` VARCHAR(191) NULL,
    MODIFY `telegramBot` VARCHAR(191) NULL,
    MODIFY `telegramChat` VARCHAR(191) NULL,
    MODIFY `pushToken` VARCHAR(191) NULL,
    MODIFY `refreshToken` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `withdrawTemplate` MODIFY `amountMultiplier` DECIMAL(10, 2) NULL,
    MODIFY `addressTag` VARCHAR(191) NULL,
    MODIFY `network` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_automationId_fkey` FOREIGN KEY (`automationId`) REFERENCES `Automation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_orderTemplateId_fkey` FOREIGN KEY (`orderTemplateId`) REFERENCES `OrderTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_withdrawTemplateId_fkey` FOREIGN KEY (`withdrawTemplateId`) REFERENCES `withdrawTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
