/*
  Warnings:

  - Changed the type of `action` on the `request126History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fromStatus` on the `request126History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toStatus` on the `request126History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Request126Status" AS ENUM ('nowhere', 'draft', 'pendingAssign', 'pendingReview', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "Request126Action" AS ENUM ('create', 'assign', 'review', 'approve', 'reject');

-- AlterTable
ALTER TABLE "request126History" DROP COLUMN "action",
ADD COLUMN     "action" "Request126Action" NOT NULL,
DROP COLUMN "fromStatus",
ADD COLUMN     "fromStatus" "Request126Status" NOT NULL,
DROP COLUMN "toStatus",
ADD COLUMN     "toStatus" "Request126Status" NOT NULL;
