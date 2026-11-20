# Digital Mana Badi Trusted Backend — Setup Notes

The frontend remains hosted on GitHub Pages. The API in this repository is a separate Node.js serverless deployment and is prepared for Vercel-compatible routing. No deployment has been performed.

## Required environment variables

Set these only in the backend hosting provider's encrypted Environment Variables settings. Never put them in GitHub, frontend JavaScript, or chat.

- `FIREBASE_SERVICE_ACCOUNT_JSON`: the complete Firebase service-account JSON object as a single environment-variable value. Use the service account for the existing `digital-mana-badi` Firebase project with the minimum required Firestore and Firebase Authentication Admin permissions.
- `STUDENT_SECRET_ENCRYPTION_KEY`: a randomly generated 32-byte key, represented as 64 hexadecimal characters. Keep it stable and back it up securely; changing it without re-encrypting records makes existing Secret Codes unreadable.
- `PARENT_SECRET_PEPPER`: a separate random secret of at least 32 characters. Keep it stable; changing it invalidates stored mobile and Secret Code verifiers.
- `CORS_ALLOWED_ORIGINS`: the exact HTTPS origin of the existing GitHub Pages site, without a path (for example, `https://OWNER.github.io`). Add a second exact origin only if a custom domain is also used.

## Frontend setting

After the API is deployed and tested, set `APP_CONFIG.backendApiBaseUrl` in `config/school-config.js` to the backend's HTTPS origin, without a trailing slash. Until this is configured, the new Class Management and Parent Verification API calls intentionally report that the trusted backend is not connected.

## API routes added

- `GET /api/classrooms` — active Head Master classroom list.
- `POST /api/classrooms` — save a class configuration.
- `GET /api/classrooms/{classId}/students` — Head Master-only student list including decrypted Secret Codes; each reveal is audited.
- `POST /api/classrooms/{classId}/students` — create a student, annual Student ID, permanent Secret Code, encrypted secret and verifier.
- `PATCH /api/students/{studentRecordId}` — Head Master changes Parent Mobile Number; only that student's old link is removed.
- `POST /api/parent/students` — lookup students associated with a Parent mobile, with server-side rate limiting.
- `POST /api/parent/verify` — DOB + Secret Code verification, atomic one-parent link claim, 5-failure / 60-second lockout and Firebase custom token.
- `GET /api/parent/children` — returns only the authenticated Parent's currently linked children.

## Important deployment gate

Before enabling the live frontend URL, configure the environment variables, deploy the API, verify Firebase project access, run the security tests, and confirm the exact frontend origin. The existing GitHub Pages deployment and `main` branch are not changed by this feature branch.
