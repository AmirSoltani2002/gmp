-- CreateTable
CREATE TABLE "drug" (
    "id" SERIAL NOT NULL,
    "drugIndexName" TEXT NOT NULL,
    "genericName" TEXT NOT NULL,
    "genericCode" TEXT NOT NULL,
    "ATC" TEXT NOT NULL,
    "officialCode" TEXT,
    "productType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drug_pkey" PRIMARY KEY ("id")
);
