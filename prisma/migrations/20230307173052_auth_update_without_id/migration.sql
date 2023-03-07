/*
  Warnings:

  - The primary key for the `Auth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Auth` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- CreateIndex
CREATE UNIQUE INDEX `Auth_userId_key` ON `Auth`(`userId`);
