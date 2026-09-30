-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Unit" ADD VALUE 'MONTH';
ALTER TYPE "Unit" ADD VALUE 'YEAR';
ALTER TYPE "Unit" ADD VALUE 'CUBIC_METER';
ALTER TYPE "Unit" ADD VALUE 'KILOMETER';
ALTER TYPE "Unit" ADD VALUE 'GRAM';
ALTER TYPE "Unit" ADD VALUE 'TON';
ALTER TYPE "Unit" ADD VALUE 'SET';
ALTER TYPE "Unit" ADD VALUE 'PACKAGE';
ALTER TYPE "Unit" ADD VALUE 'SERVICE';
ALTER TYPE "Unit" ADD VALUE 'LICENSE';
