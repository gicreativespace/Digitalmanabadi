# Teacher section

Own Teacher login, assigned classes, attendance, daily diary, homework and school notices.

- `dashboard.js` owns the Teacher-specific dashboard summary markup.
- Teacher login and teaching module screens remain in `js/core/app.js` for now.
- Teacher authentication and school data are still Preview Mode; do not imply live Firebase authentication or data access.

Extract further Teacher screens only after the trusted mobile/password authentication design and school-scoped authorization are implemented and tested.


### Login screen
Teacher-specific login form markup is owned by `login.js`; the current Teacher login remains explicitly Preview Mode until trusted mobile authentication is implemented.
