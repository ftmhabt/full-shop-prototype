/*
  Warnings:

  - You are about to drop the column `finalPriceToman` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OrderItem" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "finalPriceToman",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "oldPrice" SET DATA TYPE DECIMAL(65,30);
