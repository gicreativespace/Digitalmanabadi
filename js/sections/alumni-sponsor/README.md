# Alumni / Sponsor section

Own Alumni/Sponsor registration, school support, contributions, volunteer and message workflows.

- `alumni-sponsor-section.js` owns registration, browser-local preview storage, community module markup and action handlers.
- `dashboard.js` provides the role's dashboard extension point.
- Records remain in the existing `gim_community_preview` localStorage key. This is not live, cross-device school data or secure account authentication.

Preserve the existing preview data shape until an approved Firebase data model and Head Master approval rules are implemented.


### Login screen
Alumni/Sponsor entry markup is owned by `login.js`. Portal Preview remains explicitly labelled preview-only; registration approval and secure sign-in are not live.
