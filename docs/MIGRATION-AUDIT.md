# Digital Mana Badi — Migration Audit

**Audit date:** 17 November 2026  
**Source:** `main` at `17fd0b179b760bc41dc2cbdb8f39869a229d5c85`  
**Implementation branch:** `migration/repository-restructure`

## Confirmed current application structure

- `index.html`: application shell, header, main view, bottom navigation, footer and module entrypoints.
- `js/app.js`: approximately 82 KB of application controller and screen logic before migration. It contains Welcome, login routing, role dashboards, module rendering, parent linking, Alumni/Sponsor preview, calendar, poster editor, profile, settings, footer interaction and navigation.
- `js/admin-portal.js`: Firebase-backed GI Super Admin and Head Master portal functions.
- `js/firebase-client.js`: Firebase Web SDK initialization and client configuration.
- `js/config.js`: application name, school placeholders and preview-mode flag.
- `js/social-ribbon.js`: independent social ribbon DOM component.
- `css/styles.css`: main application styles and responsive layout.
- `css/social-ribbon.css`: social ribbon styles.
- `firestore.rules`: access is currently limited to platform admin, school, Head Master and admin audit paths; unmatched documents are denied.
- `service-worker.js` and `manifest.webmanifest`: PWA shell caching and install metadata.

## Important runtime and data findings

1. The Welcome Screen currently identifies the school as MPMP SCHOOL / DAGGULURU. These values are now sourced from the single school configuration file rather than duplicated in the screen markup.
2. The Super Admin and Head Master sign-in paths use Firebase Authentication and Firestore profile/status checks.
3. Teacher and Parent sign-in are still preview/local-browser flows; Parent linking and the Alumni/Sponsor portal also use browser-local preview data. They are not live school-data authentication or cross-device data flows.
4. The current application itself displays a preview notice for features that are not connected to Firebase. This migration preserves that distinction.
5. Firebase client configuration is public web-app configuration. No service-account key or server credential is added to the browser.
6. Firestore rules are deliberately not broadened in this structural migration. The default deny rule remains intact.
7. The current role/module screens remain in the core application controller for now. They will be extracted into role folders and shared modules in subsequent tested steps, rather than risk breaking their shared state and event handlers in a single large rewrite.

## First migration stage

- Move school and Firebase web configuration into `config/school-config.js`.
- Move translation data and role/module metadata into reusable files under `js/shared/`.
- Move the app controller into `js/core/app.js`.
- Move the Super Admin portal into `js/sections/super-admin/`.
- Move the social ribbon component into `js/shared/`.
- Keep the former file paths as compatibility shims so older links/imports do not fail.
- Update the PWA shell cache to include the new paths and bump its cache version.

## Deliberately unchanged

- Welcome Screen wording and layout, except that school name/location now read from configuration.
- Existing CSS, colour palette, responsive styling and component dimensions.
- Footer tap and 850 ms long-press behaviour.
- Social ribbon links and placement; unconfigured social URLs remain empty.
- Existing preview data storage keys and local data shape.
- Firebase Authentication flow, Firestore data model and Firestore security rules.
- Manifest icons and branding assets.

## Next migration stages

1. Extract Head Master, Teacher, Parent and Alumni/Sponsor screens into their respective folders with explicit dependencies on shared state/services.
2. Extract common modules (attendance, homework, diary, notices, calendar, student records) only after mapping their current state and event-handler dependencies.
3. Add/complete the one-file school settings workflow and role activation enforcement after trusted authorization rules are designed.
4. Implement live Teacher/Parent/Alumni authentication and school data only after the approved secure Firebase/server-side design is ready.
5. Run browser tests for every role, mobile layout, footer gestures, social ribbon, PWA installation/cache and deployment.

## Validation boundary

This audit and migration are source-level changes. A successful GitHub commit or static syntax check does not prove that the deployed app has been visually tested or that live Firebase authentication/data features are production-ready.
