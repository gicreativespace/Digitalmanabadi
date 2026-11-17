# Digital Mana Badi — Migration Audit

**Audit date:** 17 November 2026  
**Source:** `main` at `17fd0b179b760bc41dc2cbdb8f39869a229d5c85`  
**Stage 1 implementation:** `migration/repository-restructure` (merged to `main` in PR #2)\n**Stage 2 implementation branch:** `migration/stage-2-role-sections`

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
7. Role-specific screens were initially in the core application controller. Stage 2 has now moved the Parent linking workflow and Alumni/Sponsor registration/community preview workflows into their role folders, while preserving their injected shared dependencies and existing localStorage data shape.

## First migration stage

- Move school and Firebase web configuration into `config/school-config.js`.
- Move translation data and role/module metadata into reusable files under `js/shared/`.
- Move the app controller into `js/core/app.js`.
- Move the Super Admin portal into `js/sections/super-admin/`.
- Move the social ribbon component into `js/shared/`.
- Keep the former file paths as compatibility shims so older links/imports do not fail.
- Update the PWA shell cache to include the new paths and bump its cache version.

## Second migration stage — role section extraction

- Added Head Master and Teacher dashboard-summary modules under their respective role folders.
- Added Parent dashboard summary and moved the Parent–Student linking workflow into `js/sections/parent/`.
- Moved Alumni/Sponsor registration, local preview storage helpers, community module markup and action handlers into `js/sections/alumni-sponsor/alumni-sponsor-section.js`.
- Updated the core controller to call these role-owned sections through explicit dependency injection.
- Updated the PWA shell cache to v49 and included all newly imported role modules.
- Kept shared login routing, the common module renderer and cross-role feature modules in the core controller for later staged extraction.

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


## Stage 3 — shared module screens extraction
- Extracted the shared module-page renderer and its calendar, Mid-Day Meal, and Poster Studio helpers from the core controller into `js/shared/module-screens.js`.
- The shared screen factory receives the existing app state, translations, school configuration, rendering callback, and Alumni/Sponsor section adapter; role-specific workflows remain in their role folders.
- Core controller now imports and initializes the shared screen factory. Existing module names, markup, event handlers, and local preview behavior are retained.
- Service worker cache advanced to v50 and includes the new shared module file; core module URL advanced to `20261117-40`.
- No CSS, Welcome Screen, footer, social ribbon, Firebase configuration, or Firestore rules changed.
- Validation performed: source transformation anchors and service-worker cache entry updated. Browser runtime testing remains required.


## Stage 4 — role-owned login screen extraction
- Moved the shared login-screen controller into `js/shared/login-screen.js`.
- Added role-owned login view modules for Head Master, Teacher, Parent, and Alumni/Sponsor under their respective `js/sections/<role>/login.js` folders.
- The shared login controller composes role-owned form markup while retaining existing navigation, validation, Head Master Firebase sign-in call, Parent preview checks, and clearly labelled Alumni/Sponsor preview action.
- Super Admin login remains in its existing dedicated Super Admin portal module.
- Service worker cache advanced to v51; core app URL advanced to `20261117-41`.
- No authentication model or backend behavior was newly enabled. Teacher, Parent, and Alumni/Sponsor remain preview flows; existing security prerequisites remain outstanding.


## Stage 5 — shared dashboard and account screens
- Extracted the shared role dashboard renderer and common knowledge highlight into `js/shared/dashboard-screen.js`.
- Extracted shared Profile and Settings screen renderers into `js/shared/account-screens.js`.
- Core now delegates dashboard, profile, and settings rendering to the shared screen factories. Role-specific dashboard introductions remain in each role section.
- Existing Super Admin dashboard handoff, module navigation, role switching, settings actions, and logout callbacks are retained.
- Service worker cache advanced to v52; core app URL advanced to `20261117-42`.
- No role permissions, authentication model, UI styling, Welcome Screen, footer, or social ribbon changed.


## Stage 6 — shared feature modules organization
- Moved the module-page orchestration into `js/modules/module-page.js`.
- Split calendar, Mid-Day Meal preview, and Poster Studio preview helpers into `js/modules/calendar.js`, `js/modules/mid-day-meal.js`, and `js/modules/poster-studio.js`.
- Kept `js/shared/module-screens.js` as a compatibility re-export; core imports the new module path.
- Service worker cache advanced to v53; core app URL advanced to `20261117-43`.
- These remain frontend preview modules; no live data writes or authentication features were added.


## Stage 7 — footer and navigation controllers
- Extracted the existing GI Creative Space popup, footer tap/850ms long-press behavior, and footer setup into `js/shared/footer.js`.
- Extracted the existing authenticated bottom-navigation setup and active-state updates into `js/shared/navigation.js`.
- Core retains thin delegates; the footer copy, links, gesture duration, and Super Admin entry behavior are unchanged.
- Service worker cache advanced to v54; core app URL advanced to `20261117-44`.
