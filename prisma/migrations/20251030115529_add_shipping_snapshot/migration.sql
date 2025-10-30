-- DropIndex
DROP INDEX "public"."OrderItem_orderId_bundleId_idx";

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "shippingCost" INTEGER,
ADD COLUMN     "shippingMethodName" TEXT;

-- AlterTable
ALTER TABLE "public"."OrderItem" ALTER COLUMN "productId" DROP NOT NULL,
ALTER COLUMN "priceToman" DROP DEFAULT,
ALTER COLUMN "productName" DROP DEFAULT,
ALTER COLUMN "productSlug" DROP DEFAULT,
ALTER COLUMN "totalPriceToman" DROP DEFAULT;
