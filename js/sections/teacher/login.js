export function getTeacherLoginView({T}) {
  return {
    kind: "teacher",
    description: T("మీ Teacher IDతో కొనసాగండి.", "Continue with your Teacher ID."),
    formMarkup: '<div id="teacherFlow" aria-live="polite"></div>'
  };
}
