/*
  Warnings:

  - You are about to alter the column `rateTomanPerUsd` on the `ExchangeRate` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.

*/
-- AlterTable
ALTER TABLE "public"."ExchangeRate" ALTER COLUMN "rateTomanPerUsd" SET DATA TYPE DECIMAL(18,2);
