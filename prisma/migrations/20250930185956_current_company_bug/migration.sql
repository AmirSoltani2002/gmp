/*
  Warnings:

  - You are about to drop the column `currentCompanyId` on the `person` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."person" DROP CONSTRAINT "person_currentCompanyId_fkey";

-- DropIndex
DROP INDEX "public"."companyPerson_licenseNumber_key";

-- AlterTable
ALTER TABLE "public"."companyPerson" ADD COLUMN     "endedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."person" DROP COLUMN "currentCompanyId";

-- CreateIndex
CREATE INDEX "companyPerson_personId_idx" ON "public"."companyPerson"("personId");

-- CreateIndex
CREATE INDEX "companyPerson_companyId_idx" ON "public"."companyPerson"("companyId");
