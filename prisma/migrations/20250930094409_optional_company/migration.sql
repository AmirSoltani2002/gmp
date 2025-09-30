-- DropForeignKey
ALTER TABLE "public"."person" DROP CONSTRAINT "person_currentCompanyId_fkey";

-- AlterTable
ALTER TABLE "public"."person" ALTER COLUMN "currentCompanyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."person" ADD CONSTRAINT "person_currentCompanyId_fkey" FOREIGN KEY ("currentCompanyId") REFERENCES "public"."company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
