-- CreateTable
CREATE TABLE "public"."company" (
    "id" SERIAL NOT NULL,
    "nameFa" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL,
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
    "name" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "currentCompanyId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."contact" ADD CONSTRAINT "contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."person" ADD CONSTRAINT "person_currentCompanyId_fkey" FOREIGN KEY ("currentCompanyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
