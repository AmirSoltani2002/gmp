-- CreateTable
CREATE TABLE "machineType" (
    "id" SERIAL NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFa" TEXT NOT NULL,
    "scope" TEXT NOT NULL,

    CONSTRAINT "machineType_pkey" PRIMARY KEY ("id")
);
