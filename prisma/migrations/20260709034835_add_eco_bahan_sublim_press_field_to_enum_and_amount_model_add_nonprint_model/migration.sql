-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PrintType" ADD VALUE 'ecoBahan';
ALTER TYPE "PrintType" ADD VALUE 'sublimPress';

-- AlterTable
ALTER TABLE "Amount" ADD COLUMN     "ecoBahan" INTEGER,
ADD COLUMN     "sublimPress" INTEGER;

-- CreateTable
CREATE TABLE "NonPrintItem" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "pricePerItem" INTEGER NOT NULL,

    CONSTRAINT "NonPrintItem_pkey" PRIMARY KEY ("id")
);
