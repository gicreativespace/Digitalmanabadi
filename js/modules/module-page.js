import { renderCalendarMarkup } from "./calendar.js";
import { renderMidDayMealMarkup } from "./mid-day-meal.js";
import { renderPosterStudioMarkup, setupPosterStudio } from "./poster-studio.js";

export function createModulePage({main,state,T,APP_CONFIG,escapeHtml,render,alumniSponsorSection}) {
function modulePage(){
 const title=state.module||"Module";
 const cfg={
 "Attendance":["హాజరు నిర్వహణ","ఉదయం / సాయంత్రం Attendance","HM సవరణల ఆమోదం మరియు Audit History","తరగతి వారీగా హాజరు నివేదికలు"],
 "Teachers":["ఉపాధ్యాయుల జాబితా","కొత్త ఉపాధ్యాయుడిని చేర్చండి","ప్రొఫైల్ మరియు కేటాయించిన తరగతులు"],
 "Students":["విద్యార్థుల జాబితా","విద్యార్థిని చేర్చండి","Class / Roll Number నిర్వహణ"],
 "Daily Diary":["విషయాల వారీగా డైరీ","Teacher Submission","HM Review → Approve / Reject","Parentకు Approved Diary మాత్రమే"],
 "Homework":["హోంవర్క్ జాబితా","విషయం, తరగతి, Due Date","Parent View"],
 "Notice Board":["నోటీసు బోర్డు","Create Notice","HM Approval → Publish"],
 "Events & Calendar":["నెలవారీ క్యాలెండర్","Event Date Highlight","ఎంచుకున్న తేదీకి అన్ని ఈవెంట్లు"],
 "Mid-Day Meal":["ఎంచుకున్న తేదీకి భోజన వివరాలు","అదనపు ఆహారం / Sponsor వివరాలు","రోజువారీ రికార్డ్"],
 "Student Leaves":["విద్యార్థుల సెలవు అభ్యర్థనలు","తరగతి వారీగా Leave Status","Head Master పరిశీలన మరియు ఆమోదం"],
 "Class & Teacher Management":["Class Management","Teacher Management","తరగతులు మరియు ఉపాధ్యాయుల నిర్వహణ"],
 "Diary":["Class-wise Approved Diary","Subject-wise Class Work","Subject-wise Home Work"],
 "Great People & Quotes":["Great People","Great Quotes","విద్యార్థుల కోసం ప్రేరణాత్మక సమాచారం"],
 "Today Special":["పుట్టినరోజులు","జాతీయ / అంతర్జాతీయ ప్రత్యేక దినాలు","పాఠశాల ప్రత్యేకతలు"],
 "Great People":["గొప్ప వ్యక్తుల జాబితా","HM నిర్వహణ","Teacher / Parent View Only"],
 "Great Quotes":["గొప్ప సూక్తులు","HM నిర్వహణ","Teacher / Parent View Only"],
 "GI Knowledge World":["మన విజ్ఞాన ప్రపంచం","ఒకే GI Blog Link","వ్యాసాలు యాప్‌లో నిల్వ చేయబడవు"],
 "Poster Studio":["Poster Templates","Text / Color / Layout Edit","Local Preview → Share"],
 "Reports":["రోజువారీ నివేదికలు","నెలవారీ నివేదికలు","Attendance Summary"],
 "School Settings":["పాఠశాల ప్రాథమిక వివరాలు","అనుమతులు మరియు సెట్టింగ్స్"],
 "Alumni / Donor Management":["Registration approvals","Approved alumni and donors","School community records"],
 "Contact Inbox":["Messages from alumni and donors","Review and respond","Private school communication"],
 "School Requirements":["Post school needs","Review support offers","Track fulfilment"],
 "Student Adoption":["Full educational support","Specific student needs","Privacy-protected student support"],
 "School Sponsorship":["Financial sponsorship","Material sponsorship","School development support"],
 "Volunteer Management":["Mentorship requests","Volunteer offers","School approval"],
 "Volunteer & Mentorship":["Career guidance","Digital skills","Share your time and experience"],
 "Contact Head Master":["Direct school contact","Send a message","Request a meeting"],
 "Support a Requirement":["Open school needs","Express interest","Coordinate with Head Master"],
 "My Contributions":["My support history","Responses and status"],
 "Merit & Excellence Awards":["Last year class-wise best students","Academic and all-round excellence","Donor-sponsored recognition"],
 "My School":["School profile","School updates","Community information"]
 }[title]||["విభాగ వివరాలు","డెమో సమాచారం","ఈ స్క్రీన్ UI Preview దశలో ఉంది"];
 const calendar=title==="Events & Calendar";
 const hmGroupLinks={
  "Class & Teacher Management":[["Students","Class Management","తరగతులు, విద్యార్థుల జాబితా మరియు రోల్ వివరాలు"],["Teachers","Teacher Management","ఉపాధ్యాయుల వివరాలు మరియు తరగతి కేటాయింపులు"]],
  "Diary":[["Daily Diary","Class-wise Diary","ప్రతి Subjectకు Class Work వివరాలు"],["Homework","Home Work","ప్రతి Subjectకు Home Work వివరాలు"]],
  "Great People & Quotes":[["Great People","Great People","గొప్ప వ్యక్తుల జీవిత విశేషాలు"],["Great Quotes","Great Quotes","ప్రేరణాత్మక సూక్తులు"]],
  "Alumni & Donor Management":[["Alumni / Donor Management","Login Approval Requests","నమోదు మరియు లాగిన్ అభ్యర్థనలు"],["Contact Inbox","Donor Details & Offerings","దాతల వివరాలు మరియు వారి సహాయం"],["School Requirements","School Requirements","పాఠశాల అవసరాలు"],["Student Adoption","Student Adoptions","విద్యార్థుల విద్యా సహాయం"],["School Sponsorship","Donor Offerings","ఆర్థిక మరియు వస్తు రూప సహాయం"],["Volunteer Management","Volunteers","బోధన మరియు ఇతర పాఠశాల సేవలు"],["Merit & Excellence Awards","Merit, Awards & Scholarships","మెరిట్ జాబితా, అవార్డులు, స్కాలర్‌షిప్‌లు"]]
 };
 const groupLinks=state.role==="hm"?hmGroupLinks[title]:null;
 const groupMarkup=groupLinks?'<div class="detail-list hm-group-links">'+groupLinks.map(([key,label,desc])=>'<button type="button" class="detail-row" data-hm-submodule="'+escapeHtml(key)+'"><span class="detail-icon">↗</span><div><strong>'+escapeHtml(label)+'</strong><small>'+escapeHtml(desc)+'</small></div><span>›</span></button>').join("")+'</div>':title==="GI Knowledge World"&&state.role==="hm"?'<div class="detail-list"><a class="detail-row" href="'+escapeHtml(APP_CONFIG.knowledgeBlogUrl)+'" target="_blank" rel="noopener"><span class="detail-icon">◎</span><div><strong>Open GI Knowledge World Blog</strong><small>One centrally managed GI Blog</small></div><span>↗</span></a></div>':"";
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail"><h2>${escapeHtml(title)}</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>
 ${calendar?renderCalendarMarkup({state,T}):""}
 ${alumniSponsorSection.communityModuleMarkup(title)}
 ${groupMarkup}
 <div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>
 ${title==="Mid-Day Meal"?renderMidDayMealMarkup({T}):""}
 ${title==="Poster Studio"?renderPosterStudioMarkup({T,APP_CONFIG,escapeHtml}):""}
 <div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div></section>`;
 document.querySelector("#moduleBack").onclick=()=>{state.view="dashboard";render()};
 main.querySelectorAll("[data-hm-submodule]").forEach(b=>b.onclick=()=>{state.module=b.dataset.hmSubmodule;state.view="module";render()});
 main.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDate=Number(b.dataset.day);render()});
  const prev=main.querySelector("#calendarPrev"),next=main.querySelector("#calendarNext");
  if(prev)prev.onclick=()=>{state.selectedMonth--;if(state.selectedMonth<0){state.selectedMonth=11;state.selectedYear--}state.selectedDate=1;render()};
  if(next)next.onclick=()=>{state.selectedMonth++;if(state.selectedMonth>11){state.selectedMonth=0;state.selectedYear++}state.selectedDate=1;render()};
  
 setupPosterStudio();
 alumniSponsorSection.bindCommunityModuleActions();
}
 return { modulePage };
}
