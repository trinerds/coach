-- CreateTable
CREATE TABLE "MobilePushPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recommendationReady" BOOLEAN NOT NULL DEFAULT true,
    "workoutAnalysisReady" BOOLEAN NOT NULL DEFAULT true,
    "syncCompleted" BOOLEAN NOT NULL DEFAULT false,
    "coachMessage" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobilePushPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MobilePushPreference_userId_key" ON "MobilePushPreference"("userId");

-- AddForeignKey
ALTER TABLE "MobilePushPreference" ADD CONSTRAINT "MobilePushPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
