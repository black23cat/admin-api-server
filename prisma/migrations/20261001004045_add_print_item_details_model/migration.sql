-- AlterTable
ALTER TABLE "Amount" ADD COLUMN     "nonPrintAmount" INTEGER;

-- CreateTable
CREATE TABLE "PrintItemDetails" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "PrintItemDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SublimDetails" (
    "id" SERIAL NOT NULL,
    "price" INTEGER,
    "totalLength" DOUBLE PRECISION,
    "printItemDetailsId" INTEGER,

    CONSTRAINT "SublimDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SublimPressDetails" (
    "id" SERIAL NOT NULL,
    "price" INTEGER,
    "totalLength" DOUBLE PRECISION,
    "printItemDetailsId" INTEGER,

    CONSTRAINT "SublimPressDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecoDetails" (
    "id" SERIAL NOT NULL,
    "price" INTEGER,
    "totalLength" DOUBLE PRECISION,
    "printItemDetailsId" INTEGER,

    CONSTRAINT "ecoDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecoBahanDetails" (
    "id" SERIAL NOT NULL,
    "price" INTEGER,
    "totalLength" DOUBLE PRECISION,
    "printItemDetailsId" INTEGER,

    CONSTRAINT "ecoBahanDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrintItemDetails" ADD CONSTRAINT "PrintItemDetails_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SublimDetails" ADD CONSTRAINT "SublimDetails_printItemDetailsId_fkey" FOREIGN KEY ("printItemDetailsId") REFERENCES "PrintItemDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SublimPressDetails" ADD CONSTRAINT "SublimPressDetails_printItemDetailsId_fkey" FOREIGN KEY ("printItemDetailsId") REFERENCES "PrintItemDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecoDetails" ADD CONSTRAINT "ecoDetails_printItemDetailsId_fkey" FOREIGN KEY ("printItemDetailsId") REFERENCES "PrintItemDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecoBahanDetails" ADD CONSTRAINT "ecoBahanDetails_printItemDetailsId_fkey" FOREIGN KEY ("printItemDetailsId") REFERENCES "PrintItemDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
