-- Rename columns to fix typo: registeration -> registration
ALTER TABLE "public"."company" RENAME COLUMN "registerationDate" TO "registrationDate";
ALTER TABLE "public"."company" RENAME COLUMN "registerationNumber" TO "registrationNumber";

