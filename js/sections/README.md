# Role sections — ownership and extraction status

Each role owns its login/dashboard presentation and role-specific actions. Shared data services and common feature modules must not be duplicated.

- `super-admin/`: secure GI platform administration; implemented portal file is `super-admin/admin-portal.js`.
- `head-master/`: school-level administration and approvals; current screen rendering remains in `js/core/app.js`.
- `teacher/`: assigned classes, attendance, diary and homework; current screen rendering remains in `js/core/app.js` and is preview-only.
- `parent/`: linked-child information and approved school updates; current linking is browser-local preview data.
- `alumni-sponsor/`: alumni registration and school support; current records are browser-local preview data.

Extract the remaining role screens in separate tested steps. Do not create duplicate placeholder implementations or claim preview flows are live authentication.
