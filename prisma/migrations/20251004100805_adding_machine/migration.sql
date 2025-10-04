-- CreateTable
CREATE TABLE "machine" (
    "id" SERIAL NOT NULL,
    "siteId" INTEGER,
    "lineId" INTEGER,
    "machineTypeId" INTEGER NOT NULL,
    "country" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "manufactureDate" TIMESTAMP(3),
    "installationDate" TIMESTAMP(3),
    "nominalCapacity" INTEGER,
    "actualCapacity" INTEGER,
    "DQ" BOOLEAN,
    "IQ" BOOLEAN,
    "OQ" BOOLEAN,
    "PQ" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "machine" ADD CONSTRAINT "machine_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine" ADD CONSTRAINT "machine_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine" ADD CONSTRAINT "machine_machineTypeId_fkey" FOREIGN KEY ("machineTypeId") REFERENCES "machineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
