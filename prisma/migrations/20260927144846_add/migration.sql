-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nextInvoiceNumber" TEXT NOT NULL DEFAULT '1/1/1',
    "nextQuoteNumber" TEXT NOT NULL DEFAULT 'P-1/1/1',
    "defaultDueDays" INTEGER NOT NULL DEFAULT 15,
    "defaultIssuePlace" TEXT,
    "defaultPaymentMethod" "PaymentType" NOT NULL DEFAULT 'BANK_TRANSFER',
    "defaultFooterNote" TEXT,
    "emailSenderName" TEXT,
    "emailReplyTo" TEXT,
    "emailSubjectTemplate" TEXT,
    "emailBodyTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
