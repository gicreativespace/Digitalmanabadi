# Firestore admin rules setup

Paste the root `firestore.rules` file into Firebase Console → Firestore Database → Rules and Publish.

GI Super Admin can manage schools, Head Master profiles, and admin audit records. A Head Master can read only their own account record; a disabled Head Master cannot read their school document. Other collections remain denied until their school-scoped rules are designed.

On Spark Free, create the Head Master Authentication user in Firebase Console first, then use the Super Admin dashboard to link that user's UID and official email to a school. Dashboard Disable blocks protected app/Firestore access; it does not disable the Firebase Authentication identity itself.
