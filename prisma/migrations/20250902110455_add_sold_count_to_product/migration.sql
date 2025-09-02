-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "soldCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "stock" SET DEFAULT 0;
