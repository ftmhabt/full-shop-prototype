-- CreateTable
CREATE TABLE "public"."Constants" (
    "id" INTEGER NOT NULL,
    "brands" TEXT[],
    "maxFileSize" INTEGER NOT NULL,
    "markupPercent" INTEGER NOT NULL,

    CONSTRAINT "Constants_pkey" PRIMARY KEY ("id")
);
