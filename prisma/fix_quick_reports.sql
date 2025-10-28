CREATE TABLE IF NOT EXISTS "quick_reports" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "drugBrandName" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "batchNumber" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "phoneNumber" TEXT,
  "email" TEXT,
  "patientName" TEXT,
  "patientAge" INTEGER,
  "patientGender" "PatientGender",
  "drugGenericName" TEXT,
  "dosageForm" TEXT,
  "dosageStrength" TEXT,
  "gtin" TEXT,
  "uid" TEXT,
  "productionDate" TIMESTAMP(3),
  "expirationDate" TIMESTAMP(3),
  "purchaseLocation" TEXT,
  "storageDescription" TEXT,
  "defectTypes" TEXT,
  "defectDetails" TEXT,
  "productImageKey" TEXT,
  "metadata" JSONB,
  CONSTRAINT "quick_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "quick_reports_productImageKey_key"
  ON "quick_reports"("productImageKey");
