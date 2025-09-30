/*
  Warnings:

  - You are about to drop the column `currentCompanyId` on the `person` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."person" DROP CONSTRAINT "person_currentCompanyId_fkey";

-- DropIndex
DROP INDEX "public"."companyPerson_licenseNumber_key";

-- AlterTable
ALTER TABLE "public"."companyPerson" ADD COLUMN     "isThere" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."person" DROP COLUMN "currentCompanyId";
