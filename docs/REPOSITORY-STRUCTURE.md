# Digital Mana Badi — Repository Structure & Migration Status

**Architecture:** One master repository, one active school configuration, role-wise sections and shared modules.  
**Current implementation:** Stage 1 structural migration.  
**Production branch:** `main` (kept unchanged during this work).

## Current repository tree

```text
Digitalmanabadi/
├── config/
│   └── school-config.js
├── assets/
│   ├── app-icons/
│   └── branding/
├── css/
│   ├── styles.css
│   └── social-ribbon.css
├── docs/
│   ├── FIRESTORE-ADMIN-SETUP.md
│   ├── LOGIN-ARCHITECTURE.md
│   ├── MIGRATION-AUDIT.md
│   └── REPOSITORY-STRUCTURE.md
├── js/
│   ├── core/
│   │   └── app.js
│   ├── shared/
│   │   ├── role-config.js
│   │   ├── social-ribbon.js
│   │   └── translations.js
│   ├── sections/
│   │   ├── super-admin/
│   │   │   └── admin-portal.js
│   │   ├── head-master/
│   │   ├── teacher/
│   │   ├── parent/
│   │   └── alumni-sponsor/
│   ├── modules/
│   │   └── README.md
│   ├── admin-portal.js
│   ├── app.js
│   ├── config.js
│   ├── firebase-client.js
│   └── social-ribbon.js
├── firestore.rules
├── index.html
├── manifest.webmanifest
└── service-worker.js
```

The files at the old `js/` paths are compatibility shims retained intentionally. Do not delete them until all older references and deployed caches are confirmed clear.

## Configuration

All school-specific settings and the public Firebase Web App configuration are in `config/school-config.js`. There is only one active school config file; do not create separate files for individual schools.

Only public Firebase web configuration belongs in the browser. Never place service-account credentials, private keys, passwords or admin secrets in this file.

## Core and shared code

- `js/core/app.js`: current application controller. The controller is kept intact during Stage 1 because its render functions share state, event handlers and helpers.
- `js/shared/translations.js`: Telugu/English translation pairs.
- `js/shared/role-config.js`: role names, role presentation metadata and role-specific module catalogues.
- `js/shared/social-ribbon.js`: independent social ribbon component.
- `js/sections/super-admin/admin-portal.js`: Firebase-backed Super Admin and Head Master portal functions.

## Role section ownership

- `super-admin/`: secure platform administration.
- `head-master/`: school-level administration and approvals.
- `teacher/`: assigned teaching, attendance, diary and homework workflows.
- `parent/`: linked-child and approved school information.
- `alumni-sponsor/`: alumni and sponsor screens and permitted contribution/activity features.

The latter four folders are reserved for the next extraction stage. Their screen logic still resides in the core controller at this stage; no empty duplicate modules are added.

## Shared feature modules

Common features should be implemented once under `js/modules/` and granted to roles through permissions. The current feature logic remains in the core controller until each module's dependencies are mapped and tested.

## Migration safety rules

1. Keep changes on a migration branch until source and browser checks pass.
2. Preserve the original UI, colour system, content, local data keys and current interactions unless a separate product change is approved.
3. Keep Firestore rules restrictive; never solve an access issue by opening all reads/writes.
4. Do not represent preview-only login/data as production-ready.
5. Remove compatibility shims only in a separately tested release after all references are updated.
