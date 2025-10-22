-- AlterTable
ALTER TABLE "public"."Discount" ADD COLUMN     "isFirstTimeBuyer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false;
