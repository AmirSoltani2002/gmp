/*
  Warnings:

  - A unique constraint covering the columns `[licenseNumber]` on the table `companyPerson` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."companyPerson_personId_companyId_key";

-- CreateIndex
CREATE UNIQUE INDEX "companyPerson_licenseNumber_key" ON "public"."companyPerson"("licenseNumber");
