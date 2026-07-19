-- Official Mobile App is a native PKCE public client (no client_secret at token exchange).
UPDATE "OAuthApp"
SET "isPublicClient" = true
WHERE name = 'Official Mobile App';
