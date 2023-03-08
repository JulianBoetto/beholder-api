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
