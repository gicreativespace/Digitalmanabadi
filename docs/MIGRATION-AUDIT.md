# Digital Mana Badi — Migration Audit

**Audit date:** 17 November 2026
**Repository:** `gicreativespace/Digitalmanabadi`
**Main commit after Stage 7:** `b3ebfdc4f3979b8dff19f0f6f7bfadcb83cf88ef`
**Status:** Stages 1–7 structurally implemented and merged.

## Migration history

| Stage | PR | Scope | Status |
|---|---:|---|---|
| 1 | #2 | Single school config, shared translations/role config, core entrypoint, Super Admin section, compatibility shims | Merged |
| 2 | #3 | Head Master/Teacher dashboard intros, Parent linking, Alumni/Sponsor workflows | Merged |
| 3 | #4 | Shared module screen renderer, calendar, Mid-Day Meal and Poster Studio helpers | Merged |
| 4 | #5 | Shared login controller and role-owned login views | Merged |
| 5 | #6 | Shared dashboard, Profile and Settings screens | Merged |
| 6 | #7 | Feature modules organized under `js/modules/` | Merged |
| 7 | #8 | Footer and bottom-navigation controllers | Merged |

## Current ownership

- `js/core/app.js`: application bootstrap, top-level state, Welcome Screen, routing and composition.
- `js/shared/`: login orchestration, dashboard shell, account screens, footer, navigation, role configuration, translations and social ribbon.
- `js/sections/super-admin/`: GI Super Admin portal and Firebase-backed Head Master authentication helpers.
- `js/sections/head-master/`: Head Master login view and dashboard-specific content.
- `js/sections/teacher/`: Teacher login view and dashboard-specific content.
- `js/sections/parent/`: Parent login view, Parent–Student linking and dashboard-specific content.
- `js/sections/alumni-sponsor/`: Alumni/Sponsor login view, registration and community preview workflows.
- `js/modules/`: shared module page, calendar, Mid-Day Meal and Poster Studio preview modules.
- `config/school-config.js`: single active school configuration and public Firebase Web App configuration.

See `REPOSITORY-STRUCTURE.md` for the full current tree and ownership boundaries.

## Confirmed runtime/data boundaries

1. GI Super Admin and Head Master sign-in use Firebase Authentication and Firestore profile/status checks.
2. Teacher login remains Preview Mode; non-empty credentials do not represent trusted authentication.
3. Parent login/linking remains browser-local preview data; it is not verified against live school records and is not cross-device.
4. Alumni/Sponsor registration and portal preview remain browser-local/preview workflows; approval and secure account activation are not live.
5. The current app configuration still has `demoMode: true`, a blank School Code and Academic Year, and a placeholder GI Knowledge World URL.
6. Firebase Web App configuration is public client configuration. No service-account key or server credential was added.
7. Firestore rules were not opened up as part of this migration. Existing restrictive/default-deny behavior remains.
8. Existing localStorage keys and preview data shapes were preserved through extraction, including `gim_community_preview`.

## Preserved UI and interactions

- Welcome Screen design and role selection.
- Existing CSS and color palette.
- Footer text and one-tap popup.
- Footer long-press entry remains 850ms and still routes to the authenticated GI Super Admin login screen.
- Social ribbon placement and links; blank/unconfigured social URLs were not invented.
- Existing bottom navigation behavior.
- PWA manifest and branding assets.

## Source-level validation boundary

- Stage 1/2/3/4/5/6/7 changes were performed as incremental GitHub PRs and merged into `main`.
- Relative import and service-worker cache path checks were performed during the earlier stages where recorded.
- These changes are structural source edits. No browser runtime, mobile visual, PWA installation, live Firebase, security-rule integration, or deployed Pages test was performed by the assistant during this migration.
- No deployment success is claimed. The GitHub Pages URL may update after the repository's configured publishing process completes.

## Not completed by the structural migration

The following approved product/security requirements remain separate implementation work:
- Trusted Teacher and Parent mobile-number/password authentication.
- Secure school-record-based Parent linking and password recovery.
- Server-enforced failed-login attempt limits and 30-second lockout.
- Single-active-device session coordination and revocation.
- Device-local PIN setup, secure verifier storage and app resume lock.
- Alumni and Donor/Sponsor approval-backed accounts and distinct role lifecycle.
- Automatic Teacher/Parent platform ID allocation through trusted atomic server logic.
- Full school-scoped Firestore data model and security-rule tests.
- Central GI Super Admin school configuration and role activation enforcement for all existing accounts.
- Dynamic role/time/language welcome greetings and quotes.
- Production setup values: unique School Code, Academic Year, school-specific Firebase project configuration, and real GI Knowledge World URL.

Do not implement these security-sensitive items as frontend-only checks. Follow `LOGIN-ARCHITECTURE.md` and obtain the necessary trusted backend design/approval before enabling them.


## Stage 7 restoration verification
The footer and navigation extraction files and core delegates are present on the final main tree. The GI Creative Space footer popup, one-tap behavior, 850ms long-press Super Admin entry, and bottom navigation remain unchanged. Service worker cache is v54 and the core app URL is `20261117-44`.
