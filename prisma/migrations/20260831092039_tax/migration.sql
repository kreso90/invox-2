-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaxClass" ADD VALUE 'CLASS_6';
ALTER TYPE "TaxClass" ADD VALUE 'CLASS_7';

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "healthInsuranceMonthly" DOUBLE PRECISION NOT NULL DEFAULT 131.54,
ADD COLUMN     "incomeTaxQuarterly" DOUBLE PRECISION NOT NULL DEFAULT 137.70,
ADD COLUMN     "mio1MonthlyAmount" DOUBLE PRECISION NOT NULL DEFAULT 119.58,
ADD COLUMN     "mio2MonthlyAmount" DOUBLE PRECISION NOT NULL DEFAULT 39.86,
ADD COLUMN     "taxClass" "TaxClass" NOT NULL DEFAULT 'CLASS_3';
