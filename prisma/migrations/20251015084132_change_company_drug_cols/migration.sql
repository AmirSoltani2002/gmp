-- DropForeignKey
ALTER TABLE "public"."companyDrug" DROP CONSTRAINT "companyDrug_producerId_fkey";

-- AlterTable
ALTER TABLE "companyDrug" ADD COLUMN     "GTIN" TEXT,
ALTER COLUMN "producerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "companyDrug" ADD CONSTRAINT "companyDrug_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
