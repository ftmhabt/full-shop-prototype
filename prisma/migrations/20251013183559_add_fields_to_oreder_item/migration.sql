/*
  Warnings:

  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "price",
ADD COLUMN     "priceToman" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "productSlug" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "totalPriceToman" INTEGER NOT NULL DEFAULT 0;
