-- AlterTable
ALTER TABLE "Amount" ADD COLUMN     "cashbackAmount" INTEGER;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "cashbackNotes" TEXT;

-- AlterTable
ALTER TABLE "NonPrintItem" ADD COLUMN     "invoiceId" INTEGER,
ALTER COLUMN "itemName" DROP NOT NULL,
ALTER COLUMN "count" DROP NOT NULL,
ALTER COLUMN "pricePerItem" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "NonPrintItem" ADD CONSTRAINT "NonPrintItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
