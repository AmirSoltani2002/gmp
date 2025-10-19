-- CreateTable
CREATE TABLE "document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_fileKey_key" ON "document"("fileKey");

-- CreateIndex
CREATE INDEX "document_fileKey_idx" ON "document"("fileKey");

-- CreateIndex
CREATE INDEX "document_uploadedBy_idx" ON "document"("uploadedBy");

-- CreateIndex
CREATE INDEX "document_mimeType_idx" ON "document"("mimeType");
