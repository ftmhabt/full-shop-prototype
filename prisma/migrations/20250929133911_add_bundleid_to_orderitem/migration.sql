-- AlterTable
ALTER TABLE "public"."OrderItem" ADD COLUMN     "bundleId" TEXT,
ADD COLUMN     "bundleLabel" TEXT;

-- CreateIndex
CREATE INDEX "OrderItem_bundleId_idx" ON "public"."OrderItem"("bundleId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_bundleId_idx" ON "public"."OrderItem"("orderId", "bundleId");
