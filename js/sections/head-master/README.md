# Head Master section

Own the Head Master dashboard, school-level administration and approvals. Use the exact role label **Head Master**.

- `dashboard.js` owns the Head Master-specific dashboard summary markup.
- The current Firebase-backed Head Master authentication helper remains in `../super-admin/admin-portal.js` so its existing Firebase and Firestore checks are preserved.
- Remaining login handoff, module navigation and school-management rendering are still coordinated by `js/core/app.js`.

Extract additional Head Master screens only after their shared state, role permissions and Firebase dependencies are mapped and tested.
