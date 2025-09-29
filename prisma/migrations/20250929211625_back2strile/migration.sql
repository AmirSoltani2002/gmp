/*
  Warnings:

  - You are about to drop the column `isSterile` on the `line` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."line" DROP COLUMN "isSterile",
ADD COLUMN     "isStrile" BOOLEAN;
