-- CreateTable
CREATE TABLE "companyDrug" (
    "id" SERIAL NOT NULL,
    "drugId" INTEGER NOT NULL,
    "brandOwnerId" INTEGER NOT NULL,
    "IRC" TEXT NOT NULL,
    "brandNameEn" TEXT NOT NULL,
    "brandNameFa" TEXT,
    "packageCount" DOUBLE PRECISION,
    "isBulk" BOOLEAN,
    "isTemp" BOOLEAN,
    "status" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "producerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companyDrug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companyDrug_drugId_idx" ON "companyDrug"("drugId");

-- CreateIndex
CREATE INDEX "companyDrug_brandOwnerId_idx" ON "companyDrug"("brandOwnerId");

-- AddForeignKey
ALTER TABLE "companyDrug" ADD CONSTRAINT "companyDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companyDrug" ADD CONSTRAINT "companyDrug_brandOwnerId_fkey" FOREIGN KEY ("brandOwnerId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companyDrug" ADD CONSTRAINT "companyDrug_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companyDrug" ADD CONSTRAINT "companyDrug_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
