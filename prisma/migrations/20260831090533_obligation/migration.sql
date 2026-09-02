-- CreateEnum
CREATE TYPE "TaxClass" AS ENUM ('CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4', 'CLASS_5');

-- CreateEnum
CREATE TYPE "ObligationKind" AS ENUM ('MIO1', 'MIO2', 'HEALTH_INSURANCE', 'INCOME_TAX', 'PO_SD_FORM', 'KPI_LEDGER', 'PDV_FORM', 'ZP_FORM', 'OTHER');

-- CreateEnum
CREATE TYPE "ObligationStatus" AS ENUM ('PENDING', 'SUBMITTED');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "swiftCode" TEXT;

-- CreateTable
CREATE TABLE "Obligation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ObligationKind" NOT NULL,
    "title" TEXT NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION,
    "paymentModel" TEXT,
    "paymentReference" TEXT,
    "paymentDescription" TEXT,
    "status" "ObligationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Obligation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Obligation_userId_dueDate_idx" ON "Obligation"("userId", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Obligation_userId_kind_periodLabel_key" ON "Obligation"("userId", "kind", "periodLabel");

-- AddForeignKey
ALTER TABLE "Obligation" ADD CONSTRAINT "Obligation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
