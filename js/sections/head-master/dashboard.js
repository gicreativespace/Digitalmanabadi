// Head Master-specific dashboard summary. Live statistics are not connected yet.
export function renderHeadMasterDashboardIntro({state}) {
 if(state.role!=="hm") return "";
 return '<section class="stats-grid"><article class="stat-card"><strong>—</strong><span>విద్యార్థులు</span></article><article class="stat-card"><strong>—</strong><span>ఉపాధ్యాయులు</span></article><article class="stat-card"><strong>—</strong><span>ఈరోజు హాజరు</span></article><article class="stat-card"><strong>—</strong><span>పెండింగ్ ఆమోదాలు</span></article></section>';
}
