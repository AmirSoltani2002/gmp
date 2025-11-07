-- CreateTable
CREATE TABLE "Inspection" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "lineId" INTEGER NOT NULL,
    "critical" INTEGER NOT NULL DEFAULT 0,
    "major" INTEGER NOT NULL DEFAULT 0,
    "minor" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionInspector" (
    "id" SERIAL NOT NULL,
    "inspectionId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspectionInspector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqrSection" (
    "id" SERIAL NOT NULL,
    "titleFa" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "pqrSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqrItem" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "questionFa" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "pqrItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqrAnswer" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "answer" TEXT,
    "details" TEXT,

    CONSTRAINT "pqrAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Inspection_companyId_idx" ON "Inspection"("companyId");

-- CreateIndex
CREATE INDEX "Inspection_lineId_idx" ON "Inspection"("lineId");

-- CreateIndex
CREATE INDEX "InspectionInspector_inspectionId_idx" ON "InspectionInspector"("inspectionId");

-- CreateIndex
CREATE INDEX "InspectionInspector_personId_idx" ON "InspectionInspector"("personId");

-- CreateIndex
CREATE INDEX "pqrItem_sectionId_idx" ON "pqrItem"("sectionId");

-- CreateIndex
CREATE INDEX "pqrAnswer_formId_idx" ON "pqrAnswer"("formId");

-- CreateIndex
CREATE INDEX "pqrAnswer_itemId_idx" ON "pqrAnswer"("itemId");

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionInspector" ADD CONSTRAINT "InspectionInspector_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionInspector" ADD CONSTRAINT "InspectionInspector_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pqrItem" ADD CONSTRAINT "pqrItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "pqrSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pqrAnswer" ADD CONSTRAINT "pqrAnswer_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "pqrItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
