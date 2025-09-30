-- CreateTable
CREATE TABLE "public"."line" (
    "id" SERIAL NOT NULL,
    "siteId" INTEGER NOT NULL,
    "nameEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "OEB" INTEGER,
    "nameFa" TEXT,
    "isSterile" BOOLEAN,
    "actual" INTEGER,
    "startFrom" TEXT,
    "opensDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."line" ADD CONSTRAINT "line_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
