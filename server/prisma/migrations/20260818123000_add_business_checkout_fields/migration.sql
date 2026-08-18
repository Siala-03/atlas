-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryLat" DOUBLE PRECISION,
ADD COLUMN     "deliveryLng" DOUBLE PRECISION,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "tin" TEXT,
ADD COLUMN     "needsEbm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ebmPurchaseCode" TEXT,
ADD COLUMN     "ebmInvoiceEmail" TEXT;
