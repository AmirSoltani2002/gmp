/*
  Warnings:

  - You are about to drop the column `registrationData` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `registrationNumber` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `isStrile` on the `line` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."company" DROP COLUMN "registrationData",
DROP COLUMN "registrationNumber",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "registerationDate" TIMESTAMP(3),
ADD COLUMN     "registerationNumber" TEXT;

-- AlterTable
ALTER TABLE "public"."line" DROP COLUMN "isStrile",
ADD COLUMN     "isSterile" BOOLEAN;

-- AlterTable
ALTER TABLE "public"."person" ADD COLUMN     "birthCity" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "nationalId" TEXT;

-- CreateTable
CREATE TABLE "public"."companyPerson" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "licenseNumber" TEXT,
    "licenseDate" TEXT,

    CONSTRAINT "companyPerson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companyPerson_personId_companyId_key" ON "public"."companyPerson"("personId", "companyId");

-- AddForeignKey
ALTER TABLE "public"."companyPerson" ADD CONSTRAINT "companyPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companyPerson" ADD CONSTRAINT "companyPerson_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
