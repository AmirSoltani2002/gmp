/*
  Warnings:

  - You are about to drop the column `uploadedBy` on the `document` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."document_uploadedBy_idx";

-- AlterTable
ALTER TABLE "document" DROP COLUMN "uploadedBy",
ADD COLUMN     "companyId" INTEGER;

-- AlterTable
ALTER TABLE "quick_reports" ADD COLUMN     "consumptionDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "document_companyId_idx" ON "document"("companyId");
