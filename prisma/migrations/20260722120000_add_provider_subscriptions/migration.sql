CREATE TYPE "SubscriptionProvider" AS ENUM ('STRIPE', 'APPLE', 'GOOGLE');
CREATE TYPE "ProviderSubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'GRACE_PERIOD', 'BILLING_RETRY', 'PAST_DUE', 'PAUSED', 'PENDING', 'EXPIRED', 'REVOKED', 'UNKNOWN');
CREATE TYPE "SubscriptionEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');

CREATE TABLE "ProviderSubscription" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL,
  "provider" "SubscriptionProvider" NOT NULL, "externalId" TEXT NOT NULL,
  "productId" TEXT NOT NULL, "tier" "SubscriptionTier" NOT NULL,
  "status" "ProviderSubscriptionStatus" NOT NULL DEFAULT 'UNKNOWN', "rawStatus" TEXT,
  "entitlementEnd" TIMESTAMP(3), "autoRenew" BOOLEAN,
  "environment" "SubscriptionEnvironment" NOT NULL DEFAULT 'PRODUCTION', "managementUrl" TEXT,
  "lastEventId" TEXT, "lastEventAt" TIMESTAMP(3), "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProviderSubscription_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "SubscriptionLifecycleEvent" (
  "id" TEXT NOT NULL, "externalEventId" TEXT NOT NULL,
  "providerSubscriptionId" TEXT, "userId" TEXT, "provider" "SubscriptionProvider",
  "eventType" TEXT NOT NULL, "eventAt" TIMESTAMP(3) NOT NULL,
  "environment" "SubscriptionEnvironment" NOT NULL, "payload" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SubscriptionLifecycleEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProviderSubscription_provider_externalId_key" ON "ProviderSubscription"("provider", "externalId");
CREATE INDEX "ProviderSubscription_userId_status_idx" ON "ProviderSubscription"("userId", "status");
CREATE INDEX "ProviderSubscription_userId_provider_idx" ON "ProviderSubscription"("userId", "provider");
CREATE UNIQUE INDEX "SubscriptionLifecycleEvent_externalEventId_key" ON "SubscriptionLifecycleEvent"("externalEventId");
CREATE INDEX "SubscriptionLifecycleEvent_userId_eventAt_idx" ON "SubscriptionLifecycleEvent"("userId", "eventAt");
CREATE INDEX "SubscriptionLifecycleEvent_provider_eventAt_idx" ON "SubscriptionLifecycleEvent"("provider", "eventAt");
ALTER TABLE "ProviderSubscription" ADD CONSTRAINT "ProviderSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubscriptionLifecycleEvent" ADD CONSTRAINT "SubscriptionLifecycleEvent_providerSubscriptionId_fkey" FOREIGN KEY ("providerSubscriptionId") REFERENCES "ProviderSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SubscriptionLifecycleEvent" ADD CONSTRAINT "SubscriptionLifecycleEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
