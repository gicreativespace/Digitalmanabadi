# Digital Mana Badi — Locked Milestone: Opening to Login Entry

**Status:** LOCKED — approved baseline; do not redesign or modify without a new, explicit user request.  
**Repository:** https://github.com/gicreativespace/Digitalmanabadi  
**Baseline branch:** `main`  
**Baseline milestone PR:** #70 — https://github.com/gicreativespace/Digitalmanabadi/pull/70  
**Baseline merge commit:** `a038965b622099d5c9b1021023efbcce2092c7a2`  
**Live preview:** https://gicreativespace.github.io/Digitalmanabadi/

## 1. Lock instruction

The user has approved the complete experience from app opening through the Welcome Screen and role-login entry as finished and visually accepted.

Until the user explicitly requests otherwise:
- Do not change the Splash / opening tribute screen, its wording, portraits, layout, timing, animation or transitions.
- Do not change the Welcome Screen, school identity, school name/location, brand motto, role cards, card images, typography, spacing, colors or responsive layout.
- Do not change the shared header, language/theme controls, footer, footer gestures, social ribbon, its placement or its current destinations.
- Do not change the login entry screens or shared login visual design.
- Do not consolidate, rewrite, rename or reorganize the locked UI/CSS further.
- Do not make opportunistic fixes or visual "improvements" in these locked areas while implementing later modules.
- If a later task requires a change that could affect this locked area, isolate it, explain the exact impact and obtain the user's approval first.
- Continue new work from the login/authentication and role functionality layer onward, keeping the locked opening-to-login experience unchanged.
- This lock is a scope and design freeze; it does not claim every role's authentication is production-complete.

## 2. Locked opening-to-login experience

### A. App opening / tribute Splash
- Tribute screen for the school's three education contributors.
- Approved Telugu title: `మన బడి`.
- Approved tagline: `మన బాధ్యత… మన భవిష్యత్తు!`.
- Existing English app identity, tribute text, portraits, school identity, timing and transition are part of the accepted design.
- Mobile browser and installed-app viewport fixes were added separately. Preserve the current behavior and do not reopen these changes unless explicitly requested.

### B. Welcome Screen identity
Header/content hierarchy:
1. `BVR · CVPMR · DNR`
2. `DIGITAL MANA BADI`
3. Configured school name
4. Configured school location

Welcome body includes:
- `Welcome to`
- `B. V. Raju · C. V. P. Murthy Raju`
- `Dantuluri Narayana Raju`

The school name, code and location are sourced from the single active school configuration. The Telugu/English brand motto is:
- Telugu: `మన బాధ్యత… మన భవిష్యత్తు!`
- English: `Our Responsibility… Our Future!`

### C. Four visible role cards
Order and approved labels:
1. Head Master — ప్రధానోపాధ్యాయులు
2. Teachers — ఉపాధ్యాయులు
3. Parent — తల్లిదండ్రులు
4. Alumni & Sponsors — పూర్వ విద్యార్థులు & ప్రోత్సాహకులు

- English mode shows one English role name per card.
- Telugu mode shows one Telugu role name per card.
- No duplicated bilingual title in a single card.
- Role titles use a consistent font scale; Alumni & Sponsors may wrap naturally to two lines.
- Existing role images, overlays, card layout, tap targets and role-selection behavior are locked.
- The visible Welcome Screen has four cards. The fifth login, GI Super Admin, is accessed separately through the footer gesture.

### D. Social Media Ribbon
One shared component is used on Welcome and other app screens.
Current official destinations:
- Website: https://daggulurumppschoolno1.pages.dev/
- WhatsApp: https://wa.me/919666766688
- YouTube: https://youtube.com/@srinivasarajuvegesna-i1k?si=tZVzZlPjnANCrjFt
- Instagram: not supplied; remains disabled.
- Facebook: not supplied; remains disabled.

Welcome Screen: five-logo row below the four role cards and above the footer signature, with labels. Other screens: compact auto-hide ribbon. Available destinations open separately with `noopener noreferrer`.

### E. Footer
Approved signature:
- `A GI Creative Space work`
- `Inspired by Godavari.`

Existing interactions:
- Single tap opens the GI Creative Space information popup.
- Long press (850 ms) opens the GI Super Admin secure-login entry point.
- Long press is only an entry point; it must never bypass authentication or open an authenticated dashboard directly.

### F. Shared UI and presentation
- Premium, mobile-first school identity.
- Soft green/white backgrounds, deep green text/actions and restrained gold accents.
- Telugu/English language support and existing theme control.
- Existing common login visual treatment and school-building visual for school roles; separate GI branding for Super Admin.
- Preserve existing navigation, footer, role card, ribbon, screen transitions and responsive behavior.

## 3. Five login roles — agreed product logic

There are five account roles, but only four visible Welcome Screen cards. GI Super Admin is the fifth role and is reached through the footer long-press gesture.

### 1. GI Super Admin
- Platform-level administrator for GI Creative Space.
- Entry: long-press the footer signature for 850 ms.
- Daily login identifier: registered official email + password.
- Official account only; no public self-registration.
- Account uses Firebase Authentication plus Firestore profile/status checks.
- Responsible for school onboarding/configuration and creating/enabling Head Master accounts.
- The footer gesture only reveals the secure login entry; authentication remains mandatory.

### 2. Head Master
- School-level administrator; access is limited to their own school.
- Entry: first visible role card.
- Daily login: school official email + password.
- Account is created/enabled by GI Super Admin.
- Manages school staff and school operations, including Teacher account creation/management and Alumni/Donor registration approval.
- Current implementation uses Firebase Authentication with Firestore profile/status checks.
- Dashboard statistics and school-data services are not all live yet; do not infer production readiness from the login screen.

### 3. Teacher
- School staff account; access should be limited to assigned classes/subjects and permitted school data.
- Entry: second visible role card.
- Agreed daily login: registered mobile number + password.
- Teacher account is created and managed by Head Master.
- Teacher ID is generated by the Head Master workflow and is a stable school record identifier; it is not automatically the daily login identifier.
- Current login/dashboard is a clearly labelled frontend preview, not production authentication.
- A trusted phone-to-auth-account mapping and secure recovery/session enforcement must be designed before mobile + password login can be called live.

### 4. Parent
- Parent account sees only the child/children linked to that parent.
- Entry: third visible role card.
- Agreed daily login: registered mobile number + password.
- First-time child linking uses school + academic year + Student ID or Class/Roll + Date of Birth + registered guardian mobile.
- No OTP is required in the agreed linking flow. Matching must be securely rate-limited and must not reveal whether a student/account exists.
- Parent may link multiple children; separate registered guardians may have separate parent relationships/accounts.
- No Head Master approval is required for a valid parent-child match.
- The discussed linking UI shows the matched student, asks for DOB, then asks the parent to set and confirm a four-digit Parent PIN. The earlier product flow also specifies a clear Master PIN note before the parent sets their own PIN.
- Current Parent linking/login is browser-local preview data, not trusted school-record verification or production authentication. Current preview uses Student ID + four-digit PIN; this is not the final approved mobile + password authentication.
- Do not claim the Parent workflow is production-secure until trusted matching, credential handling and Firestore access rules are implemented.

### 5. Alumni / Sponsor (Alumni and Donor/Sponsor account types)
- Entry: fourth visible combined card.
- The current UI is one shared entry point, but Alumni and Donor/Sponsor are distinct account roles in the approved account architecture.
- Daily login target: registered email + password.
- First action in current UI: choose Alumni or Donor/Sponsor account type and submit a registration request; a Portal Preview option is also shown.
- Head Master approval is mandatory before account activation.
- Pending/rejected users must not access role dashboards.
- Neither role may view private student or parent data.
- The platform does not collect/process donations or payments.
- Current registration and portal preview data are browser-local preview only; approval and secure account sign-in are not yet live.

## 4. Authentication architecture — approved target vs current implementation

The agreed target is secure, role-aware authentication and authorization. Current implementation is intentionally mixed:
- GI Super Admin: Firebase Authentication + Firestore profile/status checks.
- Head Master: Firebase Authentication + Firestore profile/status checks.
- Teacher: frontend preview only.
- Parent: browser-local linking/login preview only.
- Alumni / Donor-Sponsor: browser-local registration/portal preview only.

Important security requirements already agreed:
- Do not use localStorage flags or frontend-only checks as proof of identity/authorization.
- Firebase Authentication does not natively provide mobile-number + password sign-in. Teacher/Parent need a trusted phone-to-auth-account mapping or another approved trusted design.
- Account status must be checked before access.
- School isolation and role permissions must be enforced by Firestore Security Rules / trusted authorization, not by hiding UI.
- Password reset, five-failed-attempt / 30-second lockout, one-active-device policy, device-local optional four-digit PIN, app resume lock, and session revocation must be implemented with trusted safeguards.
- Do not store passwords or plaintext PINs in localStorage/Firestore.
- Alumni/Donor activation requires Head Master approval.
- Never describe preview flows as production authentication.

The detailed approved specification is in [docs/LOGIN-ARCHITECTURE.md](LOGIN-ARCHITECTURE.md). That file remains the source of truth for detailed account security, recovery, session, ID generation and implementation requirements.

## 5. Technical and design milestone record through PR #70

The following completed work is part of the locked baseline:
- Premium shared login interface and common login renderer.
- Telugu/English login label localization.
- Four premium photo-based Welcome role cards and title alignment refinements.
- Consistent Alumni & Sponsors role title sizing/wrapping.
- Welcome motto, social ribbon and footer refinements.
- Shared compact auto-hide social ribbon behavior on non-Welcome screens.
- Tribute Splash responsive fixes for mobile browser and installed app.
- Service Worker network-first handling for same-origin document/CSS/JS requests, retaining offline fallback.
- Official Website, WhatsApp and YouTube social destinations added; Instagram/Facebook intentionally left disabled until official links are supplied.
- Welcome-only CSS extracted to `css/welcome-screen.css`, preserving the original rule declarations and cascade order. It is loaded after `css/styles.css` and before `css/social-ribbon.css`.
- Service Worker app-shell cache version at this milestone: `digital-mana-badi-preview-v106`.
- Current Welcome stylesheet reference: `css/welcome-screen.css?v=20261119-01`.
- Current social ribbon script reference: `js/shared/social-ribbon.js?v=20261119-01`.

PR #70 merged the official social links and Welcome CSS extraction:
https://github.com/gicreativespace/Digitalmanabadi/pull/70

## 6. Explicitly locked files / areas

Treat these as frozen unless the user gives a specific change request:
- `index.html` opening shell, header/footer and stylesheet/script wiring.
- `css/tribute-splash.css` and tribute Splash markup/logic.
- `css/welcome-screen.css` and Welcome-only presentation.
- Welcome-specific rules in `css/styles.css` and shared responsive rules that affect the locked screens.
- `css/social-ribbon.css` and `js/shared/social-ribbon.js`.
- `js/shared/footer.js`.
- Welcome/role-card rendering and selection logic in `js/core/app.js` and `js/shared/role-config.js`.
- Shared login visual shell in `js/shared/login-screen.js` and role login views, unless a later task explicitly targets login functionality and preserves its approved design.

This is a functional/design boundary, not a ban on all future repository work. New role functionality, backend authentication, dashboards and modules may proceed in their own areas without altering the locked opening-to-login experience.

## 7. Verification status at lock

- PR #70 is merged into `main`; merge commit recorded above.
- Source-level checks confirmed the supplied Website, WhatsApp and YouTube destinations, disabled Instagram/Facebook values, shared ribbon placement, dedicated Welcome stylesheet reference/order, Service Worker precache entry and v106 cache identifier.
- The Welcome CSS extraction was intended to preserve original declarations and order.
- No full browser/mobile/installed-app visual regression test or end-to-end role authentication test is claimed by this milestone.
- Teacher, Parent and Alumni/Sponsor flows remain preview-only as described above.

## 8. Next work boundary

Start the next phase with the five-role account/authentication and role functionality work, following `docs/LOGIN-ARCHITECTURE.md`. Do not revisit or redesign the locked Splash, Welcome, role-card appearance, shared header/footer, social ribbon, or login visual design. Any necessary integration must be additive and backward-compatible, and must be tested to ensure it does not change the locked screens.
