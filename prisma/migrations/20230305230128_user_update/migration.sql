/*
  Warnings:

  - Added the required column `accessKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pushToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sendGridKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegramBot` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegramChat` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twilioPhone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twilioSid` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twilioToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `accessKey` VARCHAR(191) NOT NULL,
    ADD COLUMN `apiUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `pushToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `secretKey` VARCHAR(191) NOT NULL,
    ADD COLUMN `sendGridKey` VARCHAR(191) NOT NULL,
    ADD COLUMN `streamUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `telegramBot` VARCHAR(191) NOT NULL,
    ADD COLUMN `telegramChat` VARCHAR(191) NOT NULL,
    ADD COLUMN `twilioPhone` VARCHAR(191) NOT NULL,
    ADD COLUMN `twilioSid` VARCHAR(191) NOT NULL,
    ADD COLUMN `twilioToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
