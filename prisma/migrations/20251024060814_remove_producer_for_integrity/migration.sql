/*
  Warnings:

  - You are about to drop the column `producerId` on the `companyDrug` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."companyDrug" DROP CONSTRAINT "companyDrug_producerId_fkey";

-- AlterTable
ALTER TABLE "companyDrug" DROP COLUMN "producerId";
