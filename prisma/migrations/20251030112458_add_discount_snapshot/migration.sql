-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "discountCode" TEXT,
ADD COLUMN     "discountType" "public"."DiscountType",
ADD COLUMN     "discountValue" INTEGER;
