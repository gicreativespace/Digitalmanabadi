# Digital Mana Badi — Backend Architecture Notes

## Agreed repository and data plan

- Keep the complete project source in this single GitHub repository.
- Keep the existing frontend hosted through GitHub Pages.
- Continue using the existing Firebase project and Firestore as the database.
- Do not move the source code to another repository.
- No Firebase Cloud Functions have been introduced or deployed.
- No backend hosting provider has been selected or deployed.

## Important technical boundary

GitHub Pages serves static frontend files. It does not execute Node.js code in the repository's `api/` directory.

The Parent Verification and Class Management API routes currently in `api/` use the Firebase Admin SDK and server-only secrets. They are source code in this repository, but they do not run merely because they are committed to GitHub or because Firestore is connected.

The frontend's `APP_CONFIG.backendApiBaseUrl` is currently empty. Do not set it to a placeholder or expose server credentials in frontend files. The new trusted API-dependent flows cannot be treated as live until a secure server-side execution method is deliberately selected and configured.

This distinction is important for security: Secret Code decryption, Firebase Admin custom-token creation, rate limiting, and privileged Head Master checks must not be moved into public browser JavaScript.

## Server-side secrets (only if/when a runtime is approved)

Keep these values exclusively in the chosen server runtime's encrypted environment settings. Never commit them to GitHub, put them in frontend JavaScript, or paste them into chat.

- `FIREBASE_SERVICE_ACCOUNT_JSON`: Firebase service-account JSON for the existing project, with minimum required permissions.
- `STUDENT_SECRET_ENCRYPTION_KEY`: stable 32-byte key encoded as 64 hexadecimal characters. Back it up securely; rotation requires a planned data migration.
- `PARENT_SECRET_PEPPER`: separate stable random secret of at least 32 characters. Rotation affects existing verifiers.
- `CORS_ALLOWED_ORIGINS`: exact HTTPS origin(s) of the approved frontend.

## Current status

- Frontend remains on GitHub Pages.
- Firestore remains the database.
- API source remains in this same repository.
- No API backend has been deployed.
- No Cloud Functions have been created.
- No hosting provider or deployment credentials have been configured.

Do not change the existing application modules or authentication flows as part of choosing a future backend runtime. Any architectural change must preserve the current security controls and be tested on a separate branch before merging.
