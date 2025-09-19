-- CreateTable
CREATE TABLE "public"."site" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "gpsLat" DOUBLE PRECISION,
    "gpsLng" DOUBLE PRECISION,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "GLN" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."site" ADD CONSTRAINT "site_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
