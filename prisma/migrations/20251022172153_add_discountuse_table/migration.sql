/*
  Warnings:

  - You are about to drop the column `isFirstTimeBuyer` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `isGlobal` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Discount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Discount" DROP COLUMN "isFirstTimeBuyer",
DROP COLUMN "isGlobal",
DROP COLUMN "startsAt",
ADD COLUMN     "neverExpires" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."DiscountUse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscountUse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscountUse_userId_discountId_key" ON "public"."DiscountUse"("userId", "discountId");

-- AddForeignKey
ALTER TABLE "public"."DiscountUse" ADD CONSTRAINT "DiscountUse_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "public"."Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
