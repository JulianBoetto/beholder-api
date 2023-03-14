/*
  Warnings:

  - You are about to alter the column `orderId` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `clientOrderId` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `orderId` INTEGER NOT NULL,
    MODIFY `clientOrderId` INTEGER NOT NULL;
