-- AlterTable
ALTER TABLE "document" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "siteDocument" (
    "id" SERIAL NOT NULL,
    "siteId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "siteDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineDocument" (
    "id" SERIAL NOT NULL,
    "lineId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "lineDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companyDocument" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "companyDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request126Document" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "request126Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "siteDocument_siteId_idx" ON "siteDocument"("siteId");

-- CreateIndex
CREATE INDEX "siteDocument_documentId_idx" ON "siteDocument"("documentId");

-- CreateIndex
CREATE INDEX "lineDocument_lineId_idx" ON "lineDocument"("lineId");

-- CreateIndex
CREATE INDEX "lineDocument_documentId_idx" ON "lineDocument"("documentId");

-- CreateIndex
CREATE INDEX "companyDocument_companyId_idx" ON "companyDocument"("companyId");

-- CreateIndex
CREATE INDEX "companyDocument_documentId_idx" ON "companyDocument"("documentId");

-- CreateIndex
CREATE INDEX "request126Document_requestId_idx" ON "request126Document"("requestId");

-- CreateIndex
CREATE INDEX "request126Document_documentId_idx" ON "request126Document"("documentId");

-- AddForeignKey
ALTER TABLE "siteDocument" ADD CONSTRAINT "siteDocument_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siteDocument" ADD CONSTRAINT "siteDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineDocument" ADD CONSTRAINT "lineDocument_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineDocument" ADD CONSTRAINT "lineDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companyDocument" ADD CONSTRAINT "companyDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companyDocument" ADD CONSTRAINT "companyDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request126Document" ADD CONSTRAINT "request126Document_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "request126"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request126Document" ADD CONSTRAINT "request126Document_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
