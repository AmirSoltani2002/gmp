/*
  Warnings:

  - You are about to drop the `contact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."contact" DROP CONSTRAINT "contact_companyId_fkey";

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "contact" TEXT;

-- DropTable
DROP TABLE "public"."contact";
