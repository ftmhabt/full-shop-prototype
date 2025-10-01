/*
  Warnings:

  - A unique constraint covering the columns `[source]` on the table `ExchangeRate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_source_key" ON "public"."ExchangeRate"("source");
