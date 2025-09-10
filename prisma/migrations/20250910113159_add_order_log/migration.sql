-- CreateTable
CREATE TABLE "public"."OrderLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderLog_orderId_idx" ON "public"."OrderLog"("orderId");

-- AddForeignKey
ALTER TABLE "public"."OrderLog" ADD CONSTRAINT "OrderLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
