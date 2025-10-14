-- CreateTable
CREATE TABLE "request126" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "lineId" INTEGER NOT NULL,
    "drugId" INTEGER NOT NULL,
    "drugOEB_declared" INTEGER NOT NULL,
    "drugOEL_declared" DOUBLE PRECISION NOT NULL,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request126_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request126History" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT NOT NULL,
    "toStatus" TEXT NOT NULL,
    "toAssigneeId" INTEGER NOT NULL,
    "message" TEXT,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request126History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "request126" ADD CONSTRAINT "request126_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request126" ADD CONSTRAINT "request126_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request126" ADD CONSTRAINT "request126_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request126History" ADD CONSTRAINT "request126History_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "request126"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request126History" ADD CONSTRAINT "request126History_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request126History" ADD CONSTRAINT "request126History_toAssigneeId_fkey" FOREIGN KEY ("toAssigneeId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
