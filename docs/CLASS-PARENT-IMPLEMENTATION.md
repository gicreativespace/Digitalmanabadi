# Digital Mana Badi — Class Management & Parent Verification

Status: Approved implementation specification
Branch: feature/parent-verification-class-management

## Scope and preservation
- Implement only Head Master Class Management and Parent Login / Parent Verification.
- Keep the existing GitHub Pages frontend and its current URL. The trusted backend is deployed separately from this same repository.
- Preserve all existing working modules, role flows, shared login interface, navigation, Teacher Management, GI Super Admin Dashboard, shared components, and unrelated configuration.
- Do not modify the shared Login Interface. The existing Parent login screen remains visually unchanged; integrate only its approved behavior.
- Keep all new UI and validation fully bilingual (Telugu and English) using the existing translation approach.
- Do not delete or overwrite historical student records.

## Class Management
- Head Master sees the existing five Class 1–5 cards. Opening a card loads its actual Firestore classroom and student records; it must not remain a static preview.
- Head Master can create/manage the classroom and student records for their own school only.
- Student profile includes student name, gender, DOB, guardian name, relationship, Parent Mobile Number, class, optional section, roll number, annual Student ID, and permanent internal Student Record ID.
- Annual Student ID format: YY + class + roll; append section letter when sections are used (example: 260101 or 260101A).
- Permanent Student Record ID and Permanent Secret Code survive promotion and academic-year changes. Annual Student ID changes on promotion. Preserve prior-year history.
- Parent Mobile Number is editable by the Head Master. Saving a changed number updates the central student record and removes only that student's previous parent link; sibling links remain unchanged.
- Teacher classroom/student workflows may consume the central records later, but Teacher Management and unrelated Teacher screens are not to be modified in this implementation.

## Permanent Secret Code — Head Master-only view
- Generate each student's permanent Secret Code with cryptographically secure randomness; never derive it from DOB, roll number, phone number, name, or another predictable value.
- Secret Code remains stable for the student's lifetime, including promotion.
- The Head Master is explicitly authorized to view the actual Secret Code for students in their own school. When the Head Master opens a classroom, each student's full profile details, including the Secret Code, are visible in that classroom's student details.
- No Teacher, Parent, GI community role, or other school account may retrieve the Secret Code through the UI or API.
- Do not store plaintext Secret Codes in Firestore. Store an authenticated-encryption ciphertext (AES-256-GCM) for authorized Head Master reveal, plus a separate one-way verifier for Parent verification. Encryption keys and verifier pepper exist only in backend environment variables, never in GitHub or browser code.
- The backend must verify Firebase ID tokens and the active Head Master role + school association on every reveal request. It must not trust a frontend role flag or merely hide the field in the UI.
- Audit every reveal with Head Master UID, school ID, student record ID, and timestamp. Never include the actual code in logs or audit records.
- The Head Master may communicate the code privately to the parent. The Parent uses DOB + Secret Code for first-time verification.

## Parent verification and linking
- No OTP.
- Parent enters registered mobile number; backend finds only the matching student's minimal list, then the parent selects a child and enters DOB + Permanent Secret Code.
- Verify DOB and the one-way Secret Code verifier on the trusted backend.
- One Parent mobile account can link multiple children. Each child is individually verified.
- One student can be linked to only one Parent mobile account at a time. Enforce this atomically in a Firestore transaction; concurrent claims must not both succeed.
- If another mobile attempts to claim an already-linked student, reject it with an Already Linked message.
- When Head Master changes a student's Parent Mobile Number, only that student's previous link is invalidated. Other siblings remain linked to the old mobile. The new mobile must complete verification.
- A verified parent account must see only its linked students. Parent data access must be enforced by backend-issued Firebase custom token/session and Firestore Security Rules, not by localStorage or a browser-only flag.
- Parent's optional four-digit PIN is a device-local convenience lock only. It is not stored in Firestore and cannot authenticate a new device. A new device must re-verify with DOB + Secret Code.
- Five incorrect Secret Code attempts trigger a server-enforced 60-second lockout. Refreshing the page or changing device time must not bypass it. Use generic failure messages and rate limits to reduce account enumeration.

## Trusted backend
- Implement backend endpoints in this same repository, separate from the static GitHub Pages frontend.
- Use Firebase Admin SDK with service-account credentials supplied only as hosting-provider environment variables. Never commit secrets or ask the user to paste credentials into chat.
- Every Head Master endpoint verifies the Firebase ID token, active role, and school ownership on the server.
- Student creation, annual ID allocation, Parent Mobile changes, Secret Code generation/reveal, Parent verification, lockout, parent linking, and parent data access are server-controlled.
- Keep the backend deployable separately. Do not claim production functionality until the provider project, environment variables, Firebase credentials, Firestore rules, and live endpoint tests are configured.
- Do not deploy, merge to main, or change the existing GitHub Pages deployment as part of this feature branch work.

## Validation checklist
- Head Master can open each class and see all student details including the Secret Code.
- Teacher and Parent cannot retrieve Secret Codes, including by calling backend endpoints directly.
- Head Master cannot access another school's student records.
- Secret Code is random, stable, encrypted at rest, and absent from logs.
- Parent verification checks DOB + code and server-side lockout.
- One mobile can link siblings; one student cannot be claimed by two mobile accounts.
- Changing one student's Parent Mobile Number invalidates only that student's old link.
- Promotion changes annual Student ID but preserves permanent Student Record ID, Secret Code, and history.
- Telugu/English language switching covers every new label, error, status, and action.
- Existing login UI, Teacher Management, GI Super Admin Dashboard, and unrelated modules remain unchanged.
