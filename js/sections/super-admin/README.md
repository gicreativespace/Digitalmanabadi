# GI Super Admin section

`admin-portal.js` owns the GI Super Admin login/dashboard and the Firebase-backed Head Master sign-in helper used by the shared role login controller.

## Security boundary
- Super Admin and Head Master sign-in use Firebase Authentication and Firestore profile/status checks.
- The browser contains only public Firebase Web App configuration.
- Do not place service-account credentials, private keys or admin secrets in this folder or any client bundle.
- Keep Firestore rules restrictive and test school isolation before enabling more data access.
- Do not treat a localStorage role/authentication flag as authorization.
