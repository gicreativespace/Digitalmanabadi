// Teacher-specific dashboard summary. Assigned classes remain preview data.
export function renderTeacherDashboardIntro({state}) {
 if(state.role!=="teacher") return "";
 return '<section class="card assigned"><h3>నా తరగతులు</h3><p>మీకు కేటాయించిన తరగతులు మాత్రమే కనిపిస్తాయి.</p><div class="chips"><span>Class 3</span><span>Class 5</span></div></section>';
}
