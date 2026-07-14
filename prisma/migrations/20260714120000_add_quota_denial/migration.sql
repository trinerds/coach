-- CreateTable
CREATE TABLE "QuotaDenial" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL,
    "limit" INTEGER NOT NULL,
    "used" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotaDenial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuotaDenial_userId_createdAt_idx" ON "QuotaDenial"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "QuotaDenial_operation_tier_createdAt_idx" ON "QuotaDenial"("operation", "tier", "createdAt");

-- CreateIndex
CREATE INDEX "QuotaDenial_createdAt_idx" ON "QuotaDenial"("createdAt");

-- AddForeignKey
ALTER TABLE "QuotaDenial" ADD CONSTRAINT "QuotaDenial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
