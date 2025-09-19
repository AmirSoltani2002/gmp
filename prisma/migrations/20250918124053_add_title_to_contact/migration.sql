/*
  Warnings:

  - You are about to drop the column `is_primary` on the `contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."contact" DROP COLUMN "is_primary",
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT;


