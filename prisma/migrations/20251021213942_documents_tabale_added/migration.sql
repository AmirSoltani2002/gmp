-- CreateTable
CREATE TABLE "document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "document_fileKey_key" ON "document"("fileKey");

-- CreateIndex
CREATE INDEX "document_fileKey_idx" ON "document"("fileKey");

-- CreateIndex
CREATE INDEX "document_uploadedBy_idx" ON "document"("uploadedBy");

-- CreateIndex
CREATE INDEX "document_mimeType_idx" ON "document"("mimeType");

-- CreateIndex
CREATE UNIQUE INDEX "siteDocument_documentId_key" ON "siteDocument"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "lineDocument_documentId_key" ON "lineDocument"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "companyDocument_documentId_key" ON "companyDocument"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "request126Document_documentId_key" ON "request126Document"("documentId");

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
