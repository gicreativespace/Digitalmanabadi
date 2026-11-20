// Digital Mana Badi — reusable per-school configuration template
// Copy this file to school-config.js for a NEW school deployment.
// Do not overwrite an existing school's config or Firebase project settings.
// Keep real Firebase configuration in the deployment's own config file;
// never place service-account private keys or passwords in browser code.

export const APP_CONFIG = {
  appNameTe: "డిజిటల్ మన బడి",
  appNameEn: "Digital Mana Badi",
  taglineTe: "మన భవిష్యత్తు… మన గర్వం!",
  taglineEn: "Our Future… Our Pride!",
  knowledgeBlogUrl: "",
  schoolName: "REPLACE_WITH_OFFICIAL_SCHOOL_NAME",
  schoolCode: "REPLACE_WITH_UNIQUE_SCHOOL_CODE",
  schoolAddress: "REPLACE_WITH_FULL_SCHOOL_ADDRESS",
  schoolLocation: "REPLACE_WITH_SCHOOL_LOCATION",
  academicYear: "REPLACE_WITH_ACADEMIC_YEAR",
  schoolLogo: "assets/branding/digital-mana-badi-logo.png",
  schoolImage: "assets/branding/school/school-building.jpg",

  // Keep preview mode enabled until every role has trusted authentication,
  // school-scoped Firestore Rules and server-enforced session controls.
  demoMode: true
};

// Replace every placeholder below with the Firebase Web App configuration
// from this school's own Firebase project. These are public client settings,
// not service-account credentials. Never commit private keys or passwords.
export const FIREBASE_CONFIG = {
  apiKey: "REPLACE_WITH_FIREBASE_WEB_API_KEY",
  authDomain: "REPLACE_WITH_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_PROJECT_ID",
  storageBucket: "REPLACE_WITH_PROJECT.firebasestorage.app",
  messagingSenderId: "REPLACE_WITH_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_WEB_APP_ID",
  measurementId: ""
};
