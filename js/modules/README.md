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
