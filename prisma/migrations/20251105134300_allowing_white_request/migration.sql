-- DropForeignKey
ALTER TABLE "public"."request126" DROP CONSTRAINT "request126_drugId_fkey";

-- DropForeignKey
ALTER TABLE "public"."request126" DROP CONSTRAINT "request126_lineId_fkey";

-- AlterTable
ALTER TABLE "request126" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "lineId" DROP NOT NULL,
ALTER COLUMN "drugId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "request126" ADD CONSTRAINT "request126_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drug"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request126" ADD CONSTRAINT "request126_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE SET NULL ON UPDATE CASCADE;
