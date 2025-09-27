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

-- AddForeignKey
ALTER TABLE "public"."lineDosage" ADD CONSTRAINT "lineDosage_dosageId_fkey" FOREIGN KEY ("dosageId") REFERENCES "public"."dosage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lineDosage" ADD CONSTRAINT "lineDosage_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "public"."line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
