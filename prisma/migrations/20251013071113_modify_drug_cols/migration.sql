/*
  Warnings:

  - You are about to drop the column `officialCode` on the `drug` table. All the data in the column will be lost.
  - You are about to drop the column `productType` on the `drug` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "drug" DROP COLUMN "officialCode",
DROP COLUMN "productType";
