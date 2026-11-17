# Shared feature modules

Shared features are implemented once under this folder and composed by the core app. Role access is granted through the role module catalogue and must also be enforced by trusted backend authorization before any protected data is exposed.

## Current modules
- `module-page.js`: shared module screen composition and module navigation.
- `calendar.js`: calendar preview rendering and date navigation view.
- `mid-day-meal.js`: Mid-Day Meal preview markup.
- `poster-studio.js`: browser-local Poster Studio rendering and download behavior.

These are UI/preview modules, not production Firebase data services. Role-specific screens and workflows remain in `js/sections/<role>/`.
