/*
  Warnings:

  - Made the column `nationalId` on table `company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."company" ALTER COLUMN "nationalId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."site" ADD COLUMN     "name" TEXT,
ADD COLUMN     "province" TEXT;
