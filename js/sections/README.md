# Role sections — ownership and extraction status

Each role owns its role-specific presentation and workflows. Shared data services and common feature modules must not be duplicated.

- `super-admin/`: secure GI platform administration; implemented in `super-admin/admin-portal.js`. Head Master Firebase authentication currently shares its trusted helper from this portal.
- `head-master/`: Head Master dashboard summary is extracted to `head-master/dashboard.js`. Remaining login handoff and school-management screens are still coordinated by `js/core/app.js`.
- `teacher/`: Teacher dashboard summary is extracted to `teacher/dashboard.js`. Login and teaching workflows remain in the core controller and are preview-only.
- `parent/`: Parent–Student linking workflow is extracted to `parent/parent-section.js`; the linked-student dashboard summary is in `parent/dashboard.js`. Current linking/login data remains browser-local preview data.
- `alumni-sponsor/`: Registration, browser-local preview data, community module markup and action handlers are extracted to `alumni-sponsor/alumni-sponsor-section.js`; its dashboard entry is in `alumni-sponsor/dashboard.js`.

## Extraction boundaries

The core controller still owns shared login routing, module navigation, common state, and feature modules that are used across roles. Continue extracting those in tested steps with explicit dependencies. Do not claim preview flows are live authentication or cross-device data.
