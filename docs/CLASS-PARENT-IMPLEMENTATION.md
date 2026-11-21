# Digital Mana Badi — Class Management and Parent Registration

## Architecture
- Static frontend hosted on GitHub Pages.
- Firebase Authentication (anonymous sessions for Parent devices) and Firestore client SDK.
- No Node API routes, Firebase Admin SDK, custom-token endpoint, or separate backend.
- Head Master access is checked against the active `platformAdmins/{uid}` profile.
- Parent devices receive a new anonymous Firebase UID when first registered on that device. A new device completes registration again with the student's Student ID, DOB, and Permanent Secret Code.

## Class Management
- Five classrooms: Class 1 through Class 5.
- Head Master creates a student using name, gender, and DOB.
- Student ID is generated as YY + two-digit class number + two-digit roll number (example: 260101).
- Roll numbers are allocated transactionally per school, academic year, and class.
- A cryptographically random 12-digit Permanent Secret Code is generated. It is stored in the Head Master-only `studentSecrets` collection; its SHA-256 verifier is checked by Firestore Rules during Parent registration.
- Guardian name, relationship, and Parent mobile are not fields in the student record. Parent name is stored in the Parent profile and relationship is stored per linked child.

## Parent registration
1. Parent enters Student ID.
2. The app locates the record and displays class/roll context without exposing DOB or the Secret Code.
3. Parent enters DOB, Permanent Secret Code, display name (first registration), and relationship.
4. The client writes a private verification claim and Parent link in one Firestore transaction. Firestore Rules compare DOB and the submitted SHA-256 verifier against the private student record and secret record.
5. Each device stores its own four-digit PIN locally using PBKDF2. The PIN is only an app/screen lock; it is not sent to Firebase and is not an account credential.
6. A new device creates a fresh anonymous Parent profile and repeats registration.
7. Parent Dashboard offers Add Your Child; each additional student is verified separately and linked to the current device profile.

## Security boundaries and limitations
- Parent clients cannot read `studentSecrets` or list all student records. They can read a student's profile only while the student's link belongs to their current anonymous UID.
- The student lookup collection exposes only the minimum lookup fields needed to resolve a Student ID; it does not contain DOB or Secret Code.
- Firestore Security Rules do not provide a robust server-side attempt counter or lockout. The 12-digit random code is high entropy, but Firebase App Check and monitoring should be enabled before production use to reduce automated abuse.
- Anonymous Authentication must be enabled in Firebase Console.
- Deploy the root `firestore.rules` to the existing Firebase project before testing these flows.
- Browser-only tests cannot replace a Firebase Emulator / live-project integration test. Verify Head Master access, registration, add-child, new-device registration, PIN lock, and cross-parent data isolation before production use.

## Preservation
Only Class Management and Parent flows are changed. Teacher, Head Master, GI Super Admin, shared login layout, and unrelated modules remain in place.
