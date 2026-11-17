# Digital Mana Badi — Repository Structure & Architecture

**Status:** Approved architecture plan  
**Repository:** `gicreativespace/Digitalmanabadi`  
**Branch:** `main`  
**Purpose:** Future reference for maintaining and gradually organizing the one master repository.

> This document records the agreed target architecture. It is not a statement that the proposed folders and files already exist. The current application must continue working while changes are introduced gradually.

## 1. Core decisions

1. **One master repository:** All schools use the same application codebase. We do not create separate repositories or school-specific source folders.
2. **One school configuration file:** School-specific values are maintained in one file: `config/school-config.js`. Updating this file and deploying the app makes the same application target the selected school.
3. **Role-wise sections:** Keep each user role's screens and role-specific behaviour in its own section folder.
4. **Shared code and common modules:** Reusable functionality is implemented once and shared. Do not duplicate the same feature in every role folder.
5. **Gradual migration:** Inspect and move existing code in small, testable steps. Preserve existing behaviour and avoid a full rewrite.
6. **No unapproved changes:** The Welcome Screen, existing footer interactions, current colour palette, social ribbon behaviour, and working modules must not be changed as a side effect of restructuring.

## 2. Target repository tree

The following is the planned structure. Add folders/files only when the corresponding code has been inspected and is ready to move.

```text
Digitalmanabadi/
│
├── config/
│   └── school-config.js
│
├── assets/
│   ├── branding/
│   ├── app-icons/
│   └── social/
│
├── css/
│   ├── styles.css
│   ├── components.css
│   ├── sections.css
│   └── social-ribbon.css
│
├── js/
│   ├── core/
│   │   ├── app.js
│   │   ├── state.js
│   │   ├── auth.js
│   │   ├── router.js
│   │   └── firebase-client.js
│   │
│   ├── shared/
│   │   ├── header.js
│   │   ├── navigation.js
│   │   ├── notifications.js
│   │   └── common.js
│   │
│   ├── sections/
│   │   ├── super-admin/
│   │   │   ├── login.js
│   │   │   └── dashboard.js
│   │   ├── head-master/
│   │   │   ├── login.js
│   │   │   └── dashboard.js
│   │   ├── teacher/
│   │   │   ├── login.js
│   │   │   └── dashboard.js
│   │   ├── parent/
│   │   │   ├── login.js
│   │   │   └── dashboard.js
│   │   └── alumni-sponsor/
│   │       ├── login.js
│   │       └── dashboard.js
│   │
│   ├── modules/
│   │   ├── attendance.js
│   │   ├── homework.js
│   │   ├── diary.js
│   │   ├── notices.js
│   │   ├── calendar.js
│   │   └── student-records.js
│   │
│   └── social-ribbon.js
│
├── docs/
│   ├── README.md
│   ├── FIREBASE-SETUP.md
│   └── REPOSITORY-STRUCTURE.md
│
├── index.html
├── firestore.rules
├── manifest.webmanifest
└── service-worker.js
```

## 3. Single school configuration

All school-specific settings belong in `config/school-config.js`, not in separate files for each school.

The configuration should cover:

- School name and school code
- School address (village, mandal, district, state, PIN code as applicable)
- App name and tribute/personality name
- Academic year
- School branding/logo asset path
- Role activation: Head Master, Teacher, Parent, Alumni / Sponsor
- Firebase web-app configuration for the school deployment

There must be only **one active school configuration per deployed app build**. To point the app to another school, update this one configuration file and deploy again. Do not create `school-a.js`, `school-b.js`, or similar school-specific config files.

**Security:** Only public Firebase web configuration belongs in this file. Never put service-account keys, private keys, passwords, or admin credentials in client-side code. Authentication and Firestore Security Rules must enforce access; hiding a role in the interface is not sufficient.

## 4. Role sections and shared modules

Each role folder owns its role-specific login/dashboard presentation and role-specific actions:

- `super-admin/`: secure Super Admin access. Its dashboard is intentionally limited to **School Details** and **Login Activation**.
- `head-master/`: Head Master screens and authorised school-management actions. Use the label **Head Master**, never “Principal”.
- `teacher/`: teacher screens and authorised teaching actions.
- `parent/`: parent screens and access to their linked child information.
- `alumni-sponsor/`: alumni and sponsor screens and permitted contribution/activity features.

Common features such as attendance or notices should live in `modules/` and be reused by roles according to permissions. Do not copy the same data logic into multiple role folders. Role permissions must also be checked by trusted backend/security rules, not only by front-end code.

## 5. Migration approach

1. Inspect the current files and map each existing function to its future location.
2. Identify the current school settings in `js/config.js` and plan the move into the single school configuration.
3. Move one responsibility at a time into the target folders; update imports/references carefully.
4. After each move, test the affected screen and the existing flows.
5. Test all five role areas, role activation enforcement, Firebase access rules, and data isolation.
6. Test Welcome Screen, footer tap/long-press behaviour, social ribbon, responsive layouts, PWA icons, offline cache, and deployment.

Do not delete an old file until its code has been moved, all references have been updated, and the app has been tested.

## 6. Preserve these existing product decisions

- Keep the approved Welcome Screen content and layout unchanged unless separately requested.
- Keep the existing footer text and interactions unchanged:
  - `A GI Creative Space work`
  - `Inspired by Godavari.`
  - One tap opens the GI Creative Space popup.
  - Long press (850 ms) opens the authenticated Super Admin login.
- Keep the agreed colour palette and readable, mobile-first design.
- Keep the social ribbon placement and auto-hide behaviour already agreed.
- Do not use “Principal” anywhere in the app; the role label is “Head Master”.
- Do not add extra Super Admin dashboard cards, charts, statistics, or school-directory features without approval.

## 7. Current structure versus target structure

The current repository already contains `assets/`, `css/`, `docs/`, `js/`, `firestore.rules`, `index.html`, `manifest.webmanifest`, and `service-worker.js`. The role-wise folders, `config/school-config.js`, and the proposed split files are future target items; they must not be described as existing until actually created.

This document is the reference for future planning. Any implementation should be done incrementally and only after reviewing the current source code and confirming the specific change.
