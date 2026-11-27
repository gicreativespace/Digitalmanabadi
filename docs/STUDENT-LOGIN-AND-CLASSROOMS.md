# Digital Mana Badi — Student Login and Classroom Setup

## Student ID and class structure
- Student ID format: `YYCCRR` (two-digit academic year, two-digit class number, two-digit roll number), for example `260101`.
- Login ID: `studentId@dagguluruschool.in`.
- Roll allocation is transactional and shared across every section within the same school, academic year and class. Section A/B/C never restarts the roll sequence.
- Sections are optional. A Head Master can configure section labels such as A, B and C for each class.
- A class can have one active Class Teacher selected from the existing Teacher records. The selected teacher must be active and assigned to that class.
- Removing a section that still contains enrolled students is blocked.

## Head Master workflow
1. Open Class & Teacher Management → Class Management.
2. Open Class 1–5.
3. Configure optional sections and select an eligible Class Teacher; save settings.
4. Set the class strength and enter student name, gender, date of birth and section where configured.
5. Save the register. The app assigns the next class-wide roll number, Student ID and a cryptographically random 12-digit Secret Code.
6. Use Create Student Login. The Firebase account is linked to the student record and the Login ID is displayed.

The Secret Code is private and visible only to the Head Master. Share it with the student through a trusted channel.

## Student first-time login
- Open the dedicated portal URL: `https://gicreativespace.github.io/Digitalmanabadi/?portal=student`.
- Enter the six-digit Student ID and the 12-digit Secret Code.
- Firebase Authentication verifies the account. Firestore then confirms the Firebase UID is linked to that active student record.
- On first use of each device, the student sets and confirms a four-digit local PIN.
- The PIN is stored on that device as a PBKDF2-SHA-256 salted verifier. It is a convenience lock, not a replacement for Firebase identity.
- On later visits to the same device, the Firebase session is revalidated and the student unlocks with the local PIN. A new device requires the Secret Code again.
- The Student Dashboard shows the verified profile, Student ID, class/section, roll number and academic year. Attendance, Diary and Homework are shown as future integrations until those school data modules are connected.

## Security boundaries
- Student accounts cannot list students, read another student's record, or read the Head Master-only Secret Code collection.
- A Student may read only the active student record whose `authUid` matches the Firebase Authentication UID.
- The shared Welcome role cards and existing Head Master, Teacher, Parent and GI Super Admin login visuals are not changed. Student access uses the dedicated query-string portal route.
- Device-local PIN storage is not tamper-proof and must not be treated as remote authentication.
