export function getTeacherLoginView({T}) {
  return {
    kind: "teacher",
    description: T("మీ Teacher IDతో కొనసాగండి.", "Continue with your Teacher ID."),
    formMarkup: '<style>.teacher-name-confirm{display:grid;gap:5px;margin:4px 0 16px;padding:14px;border:1px solid var(--border);border-radius:13px;background:var(--surface2)}.teacher-name-confirm small{font-size:12px;color:var(--muted)}.teacher-name-confirm strong{font-size:18px;color:var(--text)}.teacher-flow-hint{margin:0 0 14px;color:var(--muted);font-size:13px;line-height:1.6}#teacherFlow h3{margin:0 0 8px;font-size:19px;color:var(--text)}#teacherFlow .text-link{display:block;margin:12px auto 0}</style><div id="teacherFlow" aria-live="polite"></div>'
  };
}
