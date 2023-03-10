/*
  Warnings:

  - Added the required column `base` to the `Symbol` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quote` to the `Symbol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Symbol` ADD COLUMN `base` VARCHAR(191) NOT NULL,
    ADD COLUMN `quote` VARCHAR(191) NOT NULL;
