# Shared application modules — extraction plan

The current controller contains shared feature rendering and event handling. Extract each feature only after its dependencies on application state, role permissions, Firebase services and DOM handlers have been mapped.

| Planned module | Current implementation area |
|---|---|
| Attendance | `dashboard()`, `modulePage()` |
| Homework | `modulePage()` |
| Daily diary | `modulePage()` |
| Notices | `modulePage()` |
| Calendar | `calendarMarkup()`, `modulePage()` |
| Student records | `linking()`, role dashboard/module rendering |
| Poster Studio | `posterMarkup()`, `setupPosterEditor()` |
| Alumni/Sponsor community | `communityRegister()`, `communityModuleMarkup()`, `bindCommunityModuleActions()` |

These are mapping notes, not claims that every feature is already connected to live Firebase data.


### Shared module screens
The shared module-page renderer, calendar, Mid-Day Meal preview, and Poster Studio preview are implemented once in `../shared/module-screens.js`. Role-specific data and workflows stay in their owning role sections.
