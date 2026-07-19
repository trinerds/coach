-- AlterTable
ALTER TABLE "OAuthApp" ADD COLUMN "isOfficial" BOOLEAN NOT NULL DEFAULT false;

-- Backfill Official Mobile App as first-party (clear isTrusted so flags stay distinct)
UPDATE "OAuthApp"
SET "isOfficial" = true,
    "isTrusted" = false
WHERE name = 'Official Mobile App';
