# Digital Mana Badi — Reusable Multi-School Setup

**Purpose:** Use one maintained Digital Mana Badi codebase for multiple schools while keeping each school's identity, Firebase data and account records separate.

## Non-negotiable preservation rule

The approved Opening-to-Login interface remains locked. Do not edit or reformat:
- Tribute Splash / opening screen
- Welcome Screen, role cards, branding, school identity presentation or layout
- Shared header, footer, footer gestures and social ribbon
- Shared Login Entry visual design and its CSS

The locked baseline is documented in [LOCKED-OPENING-TO-LOGIN.md](./LOCKED-OPENING-TO-LOGIN.md). School-specific values already flow into the existing Welcome Screen through `config/school-config.js`; do not change the rendering code to onboard a new school.

## Reuse model

- Maintain one master repository and one shared application codebase.
- Create a separate deployment/configuration for each school.
- Each school deployment uses its own `config/school-config.js` values and its own Firebase project.
- Do not copy another school's live Firebase configuration, Authentication users, Firestore data, Storage bucket or secrets.
- The current MPMP School configuration and existing Firebase project remain unchanged.

## New-school configuration procedure

1. Create a new deployment from the approved master repository version.
2. Copy `config/school-config.template.js` to that deployment as `config/school-config.js`.
3. Replace the school name, unique school code, address, location and academic year.
4. Create a separate Firebase project for that school.
5. Register the web app in that Firebase project and copy its Web App configuration into `FIREBASE_CONFIG`.
6. Enable only the Firebase services required by the app. Apply reviewed, school-scoped Firestore Rules before enabling real user access.
7. Create the school's official Head Master email account in the intended Firebase Authentication project, then securely provide the login details to the Head Master. Do not put passwords in source control or configuration files.
8. Keep `demoMode: true` until every role's authentication and authorization is genuinely implemented and tested. Do not switch it off merely to hide preview labels.
9. Verify the new deployment's school name/location, role selection, login routing and data isolation. Do not alter locked UI files to do this.

## Platform control versus school projects

The GI Super Admin's agreed scope is limited to:
- Global app Enable / Disable
- Platform Firebase / Firestore analytics
- Storage usage monitoring and management

GI Super Admin does **not** create or enable Head Master accounts under the latest product decision. The school email and school Firebase project are provisioned by the platform owner/operator outside that dashboard; the Head Master receives the prepared login details.

A separate Firebase project per school means a global switch cannot be securely enforced by a local flag in one school's Firestore. A trusted central control service must publish/serve the platform status to every school deployment, and every protected session/data operation must fail closed when the status cannot be verified. Session revocation across projects also needs a trusted, server-enforced mechanism. This central service is an architecture requirement, **not yet implemented by this configuration template**.

## Existing account preservation

- Never recreate, reset, rename or overwrite the existing GI Super Admin Authentication user.
- Never recreate, reset, rename or overwrite the existing Head Master Authentication user.
- Preserve the existing `digital-mana-badi` Firebase project and the current MPMP School configuration.
- For changes to an existing deployment, inspect its Firebase project ID and account UIDs first. Only add or update the intended school profile metadata; do not change credentials.

## Security boundaries

- Firebase Web App config is not a service-account credential. Never commit service-account JSON, private keys, passwords, PINs, Secret Codes or recovery secrets.
- DOB/ID-derived values are guessable and must not be treated as strong authentication secrets.
- Client-side role flags, localStorage values and cached records are not authorization.
- Firestore Rules and trusted backend checks must enforce school isolation and account status.
- Offline cache may display previously synchronized data only according to the approved offline policy; a disabled account must not continue protected access or submit writes.
- Firestore read optimization must not skip essential status/security checks.

## Current implementation status

This PR adds a reusable configuration template and onboarding guide only. It does not claim to implement:
- Central cross-project Global Enable / Disable
- Cross-project immediate session revocation
- Production Teacher/Parent mobile + 4-digit PIN authentication
- Trusted Secret Code activation/recovery
- Production incremental Smart Sync / encrypted offline cache
- Central Firebase analytics/storage aggregation

Those require separately reviewed backend, Firebase Rules and deployment changes. Keep preview mode enabled until they are implemented and verified.
