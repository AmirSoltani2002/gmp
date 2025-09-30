-- CreateTable
CREATE TABLE "public"."company" (
    "id" SERIAL NOT NULL,
    "nameFa" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "description" TEXT,
    "img" TEXT,
    "nameEn" TEXT,
    "country" TEXT,
    "mainAddress" TEXT,
    "website" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "registerationDate" TIMESTAMP(3),
    "registerationNumber" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companyPerson" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "licenseNumber" TEXT,
    "licenseDate" TEXT,

    CONSTRAINT "companyPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "cityCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."person" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "familyName" TEXT,
    "nezamCode" TEXT,
    "currentCompanyId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "nationalId" TEXT,
    "birthCity" TEXT,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

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
    "province" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dosage" (
    "id" SERIAL NOT NULL,
    "emaCode" TEXT NOT NULL,
    "category" TEXT,
    "labelEn" TEXT,
    "labelFa" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dosage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lineDosage" (
    "id" SERIAL NOT NULL,
    "dosageId" INTEGER NOT NULL,
    "lineId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lineDosage_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "companyPerson_personId_companyId_key" ON "public"."companyPerson"("personId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "person_username_key" ON "public"."person"("username");

-- AddForeignKey
ALTER TABLE "public"."companyPerson" ADD CONSTRAINT "companyPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companyPerson" ADD CONSTRAINT "companyPerson_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact" ADD CONSTRAINT "contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."person" ADD CONSTRAINT "person_currentCompanyId_fkey" FOREIGN KEY ("currentCompanyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."site" ADD CONSTRAINT "site_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lineDosage" ADD CONSTRAINT "lineDosage_dosageId_fkey" FOREIGN KEY ("dosageId") REFERENCES "public"."dosage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lineDosage" ADD CONSTRAINT "lineDosage_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "public"."line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."line" ADD CONSTRAINT "line_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
