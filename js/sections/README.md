# Role sections — ownership and extraction status

Each role owns its login view, dashboard-specific presentation and role-specific workflows. Shared rendering and common feature behavior are implemented once outside role folders.

- `super-admin/`: GI platform administration, Super Admin login/dashboard, and Firebase-backed Head Master authentication helper in `admin-portal.js`.
- `head-master/`: Head Master login view in `login.js` and dashboard summary in `dashboard.js`. Full school management workflows remain preview UI/shared module composition until implemented.
- `teacher/`: Teacher login view in `login.js` and dashboard summary in `dashboard.js`. Teacher authentication and teaching data remain Preview Mode.
- `parent/`: Parent login view, Parent–Student linking workflow in `parent-section.js`, and dashboard summary in `dashboard.js`. Current linking/login remains browser-local preview data.
- `alumni-sponsor/`: Alumni/Sponsor login view, registration/community preview workflows in `alumni-sponsor-section.js`, and dashboard extension point in `dashboard.js`.

## Shared boundaries

- Common login orchestration: `js/shared/login-screen.js`.
- Common dashboard shell: `js/shared/dashboard-screen.js`.
- Shared account screens: `js/shared/account-screens.js`.
- Common modules: `js/modules/`.
- Core app bootstrap and routing: `js/core/app.js`.

Do not duplicate shared state/services inside role folders. Do not claim preview flows are live authentication or cross-device data.
