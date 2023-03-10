/*
  Warnings:

  - Added the required column `stepSize` to the `Symbol` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tickSize` to the `Symbol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Symbol` ADD COLUMN `stepSize` VARCHAR(191) NOT NULL,
    ADD COLUMN `tickSize` VARCHAR(191) NOT NULL;
