-- CreateTable
CREATE TABLE "MobilePushDevice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "appVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobilePushDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MobilePushDevice_token_key" ON "MobilePushDevice"("token");

-- CreateIndex
CREATE INDEX "MobilePushDevice_userId_idx" ON "MobilePushDevice"("userId");

-- AddForeignKey
ALTER TABLE "MobilePushDevice" ADD CONSTRAINT "MobilePushDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
