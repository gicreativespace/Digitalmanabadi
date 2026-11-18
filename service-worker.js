const CACHE_NAME = "digital-mana-badi-preview-v87";
const APP_SHELL = ["./", "./index.html", "./css/styles.css", "./css/headmaster-login.css", "./css/social-ribbon.css", "./css/tribute-splash.css", "./js/core/app.js", "./js/shared/tribute-splash.js", "./js/shared/translations.js", "./js/shared/role-config.js", "./js/shared/module-screens.js", "./js/modules/module-page.js", "./js/modules/calendar.js", "./js/modules/mid-day-meal.js", "./js/modules/poster-studio.js", "./js/shared/login-screen.js", "./js/shared/dashboard-screen.js", "./js/shared/account-screens.js", "./js/shared/footer.js", "./js/shared/navigation.js", "./js/sections/head-master/login.js", "./js/sections/teacher/login.js", "./js/sections/parent/login.js", "./js/sections/alumni-sponsor/login.js", "./js/shared/social-ribbon.js", "./js/sections/super-admin/admin-portal.js", "./js/sections/head-master/dashboard.js", "./js/sections/teacher/dashboard.js", "./js/sections/parent/parent-section.js", "./js/sections/parent/dashboard.js", "./js/sections/alumni-sponsor/alumni-sponsor-section.js", "./js/sections/alumni-sponsor/dashboard.js", "./js/app.js", "./js/social-ribbon.js", "./js/config.js", "./js/firebase-client.js", "./js/admin-portal.js", "./config/school-config.js", "./manifest.webmanifest", "./assets/branding/digital-mana-badi-logo.png", "./assets/branding/gi-creative-space-logo.jpg", "./assets/branding/school/school-building.jpg", "./assets/branding/roles/sarvepalli-radhakrishnan.webp", "./assets/branding/roles/savitribai-phule.webp", "./assets/branding/roles/apj-abdul-kalam-family.webp", "./assets/branding/roles/indian-philanthropists.webp", "./assets/branding/tribute/b-v-raju.jpg", "./assets/branding/tribute/c-v-p-murthy-raju.jpg", "./assets/branding/tribute/d-n-raju.jpg", "./assets/app-icons/icon-192.png", "./assets/app-icons/icon-512.png", "./assets/app-icons/favicon-32.png", "./assets/app-icons/favicon.ico"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(cached => cached || fetch(event.request)));
});
