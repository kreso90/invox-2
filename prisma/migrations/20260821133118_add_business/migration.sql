-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "oib" TEXT NOT NULL,
    "vatId" TEXT,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'HR',
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "iban" TEXT,
    "description" TEXT,
    "activity_code" TEXT,
    "annual_threshold" DOUBLE PRECISION,
    "threshold_warning_pct" DOUBLE PRECISION,
    "logo_url" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_userId_key" ON "Business"("userId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
