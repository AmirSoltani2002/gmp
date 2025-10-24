-- AlterTable
ALTER TABLE "companyDrug" ADD COLUMN     "lineId" INTEGER;

-- AddForeignKey
ALTER TABLE "companyDrug" ADD CONSTRAINT "companyDrug_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE SET NULL ON UPDATE CASCADE;
