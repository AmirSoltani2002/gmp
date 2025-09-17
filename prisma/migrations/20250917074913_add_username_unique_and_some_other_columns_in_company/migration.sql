/*
  Warnings:

  - You are about to drop the column `desc` on the `company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `person` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."company" DROP COLUMN "desc",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "mainAddress" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "registrationData" TIMESTAMP(3),
ADD COLUMN     "registrationNumber" INTEGER,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "nationalId" DROP NOT NULL,
ALTER COLUMN "img" DROP NOT NULL,
ALTER COLUMN "nameEn" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "person_username_key" ON "public"."person"("username");
