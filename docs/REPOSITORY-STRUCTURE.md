# Digital Mana Badi — Repository Structure

**Architecture:** One master repository, one active school configuration file, five role-owned sections, and shared feature modules.
**Migration status:** Structural migration Stages 1–7 merged into `main`.
**Verified main commit at this documentation update:** `b3ebfdc4f3979b8dff19f0f6f7bfadcb83cf88ef`.

## Current repository tree

```text
Digitalmanabadi/
├── assets/
│   ├── app-icons/
│   └── branding/
├── config/
│   └── school-config.js
├── css/
│   ├── social-ribbon.css
│   └── styles.css
├── docs/
│   ├── FIRESTORE-ADMIN-SETUP.md
│   ├── LOGIN-ARCHITECTURE.md
│   ├── MIGRATION-AUDIT.md
│   └── REPOSITORY-STRUCTURE.md
├── js/
│   ├── core/
│   │   └── app.js
│   ├── shared/
│   │   ├── account-screens.js
│   │   ├── dashboard-screen.js
│   │   ├── footer.js
│   │   ├── login-screen.js
│   │   ├── module-screens.js        # compatibility re-export
│   │   ├── navigation.js
│   │   ├── role-config.js
│   │   ├── social-ribbon.js
│   │   └── translations.js
│   ├── sections/
│   │   ├── README.md
│   │   ├── super-admin/
│   │   │   └── admin-portal.js
│   │   ├── head-master/
│   │   │   ├── dashboard.js
│   │   │   └── login.js
│   │   ├── teacher/
│   │   │   ├── dashboard.js
│   │   │   └── login.js
│   │   ├── parent/
│   │   │   ├── dashboard.js
│   │   │   ├── login.js
│   │   │   └── parent-section.js
│   │   └── alumni-sponsor/
│   │       ├── alumni-sponsor-section.js
│   │       ├── dashboard.js
│   │       └── login.js
│   ├── modules/
│   │   ├── calendar.js
│   │   ├── mid-day-meal.js
│   │   ├── module-page.js
│   │   ├── poster-studio.js
│   │   └── README.md
│   ├── admin-portal.js              # compatibility shim
│   ├── app.js                       # compatibility shim
│   ├── config.js                    # compatibility shim
│   ├── firebase-client.js
│   └── social-ribbon.js             # compatibility shim
├── firestore.rules
├── index.html
├── manifest.webmanifest
└── service-worker.js
```

## Ownership boundaries

### Core
- `js/core/app.js` owns application bootstrap, top-level state, welcome screen, global rendering and routing.
- It composes shared screens and role-owned section adapters through explicit dependency injection.
- It should not accumulate role-specific feature implementations again.

### Shared UI and services
- `js/shared/login-screen.js`: common login orchestration.
- `js/shared/dashboard-screen.js`: common dashboard shell and role module navigation.
- `js/shared/account-screens.js`: shared Profile and Settings screens.
- `js/shared/footer.js`: GI Creative Space popup and existing footer gestures.
- `js/shared/navigation.js`: authenticated bottom navigation.
- `js/shared/role-config.js`: role names, metadata and module catalogues.
- `js/shared/translations.js`: Telugu/English translation pairs.
- `js/shared/social-ribbon.js`: independent social ribbon component.

### Role-owned sections
- `super-admin/`: GI platform administration and Firebase-backed Super Admin / Head Master authentication helpers.
- `head-master/`: Head Master login view and dashboard-specific content.
- `teacher/`: Teacher login view and dashboard-specific content.
- `parent/`: Parent login view, Parent–Student linking workflow and dashboard-specific content.
- `alumni-sponsor/`: Alumni/Sponsor entry view, registration and community preview workflows.

Role-specific screens belong in their role folder. Shared behavior must be implemented once under `js/shared/` or `js/modules/`, not copied across role folders.

### Shared feature modules
- `module-page.js`: shared module-page composition.
- `calendar.js`: calendar preview.
- `mid-day-meal.js`: Mid-Day Meal preview.
- `poster-studio.js`: browser-local Poster Studio preview and download.

These are UI/preview modules. They are not live school-data services.

## One-file school configuration

`config/school-config.js` is the single active school configuration file. It contains:
- App name and tagline
- School name, code, address, location and academic year
- School branding path
- Preview-mode flag
- Public Firebase Web App configuration

To point this master app at another school, update the single configuration file and use that school's separately provisioned Firebase project configuration. Do not create one configuration file per school in this repository. Never place service-account keys, private keys or admin credentials in browser code.

Current configuration still has placeholder values that must be completed before a school-specific production release: school code, academic year and the GI Knowledge World URL. `demoMode` remains enabled.

## Firebase and preview boundaries

- GI Super Admin and Head Master sign-in use Firebase Authentication and Firestore profile/status checks.
- Teacher, Parent and Alumni/Sponsor remain preview/local-browser flows. Their current screens do not provide production authentication or cross-device school data.
- Parent linking and Alumni/Sponsor preview data remain browser-local.
- Existing Firestore rules remain restrictive. Do not broaden access to make a preview feature appear live.
- The approved secure mobile/password authentication, recovery, PIN/session policy, account lifecycle and school-isolation requirements are specified in `LOGIN-ARCHITECTURE.md`; they are not completed by this structural migration.

## Compatibility shims

The old `js/app.js`, `js/admin-portal.js`, `js/config.js` and `js/social-ribbon.js` paths remain as small compatibility shims. `js/shared/module-screens.js` is a compatibility re-export to the module implementation. Keep these until deployed caches and all external references are confirmed clear; remove them only in a separately tested change.

## Migration and validation rules

1. Keep future changes scoped and incremental; preserve existing functionality and local data shapes.
2. Preserve the Welcome Screen, palette, footer behavior and social ribbon unless separately approved.
3. Validate relative imports and service-worker cache paths after every file move.
4. Browser, mobile, PWA and live Firebase testing must be recorded separately from source-level checks.
5. Never describe preview flows as production authentication or production data access.
