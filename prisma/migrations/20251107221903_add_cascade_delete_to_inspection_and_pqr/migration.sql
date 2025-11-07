-- DropForeignKey
ALTER TABLE "public"."InspectionInspector" DROP CONSTRAINT "InspectionInspector_inspectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pqrAnswer" DROP CONSTRAINT "pqrAnswer_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pqrItem" DROP CONSTRAINT "pqrItem_sectionId_fkey";

-- AddForeignKey
ALTER TABLE "InspectionInspector" ADD CONSTRAINT "InspectionInspector_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pqrItem" ADD CONSTRAINT "pqrItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "pqrSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pqrAnswer" ADD CONSTRAINT "pqrAnswer_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "pqrItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
