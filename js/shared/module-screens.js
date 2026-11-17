// Shared module screens used by all role dashboards.
// Role-specific workflows remain in their owning section folders.
export function createSharedScreens({main,state,T,APP_CONFIG,escapeHtml,render,alumniSponsorSection}) {
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
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail"><h2>${escapeHtml(title)}</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>
 ${calendar?calendarMarkup():""}
 ${alumniSponsorSection.communityModuleMarkup(title)}
 <div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>
 ${title==="Mid-Day Meal"?mealMarkup():""}
 ${title==="Poster Studio"?posterMarkup():""}
 <div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div></section>`;
 document.querySelector("#moduleBack").onclick=()=>{state.view="dashboard";render()};
 main.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDate=Number(b.dataset.day);render()});
  const prev=main.querySelector("#calendarPrev"),next=main.querySelector("#calendarNext");
  if(prev)prev.onclick=()=>{state.selectedMonth--;if(state.selectedMonth<0){state.selectedMonth=11;state.selectedYear--}state.selectedDate=1;render()};
  if(next)next.onclick=()=>{state.selectedMonth++;if(state.selectedMonth>11){state.selectedMonth=0;state.selectedYear++}state.selectedDate=1;render()};
  
 setupPosterEditor();
 alumniSponsorSection.bindCommunityModuleActions();
}
function mealMarkup(){return `<section class="meal-day"><label for="mealDate">${T("తేదీ ఎంచుకోండి","Select date")}</label><input id="mealDate" type="date" value="2026-11-17"><div class="meal-result"><h3>${T("ఈ తేదీ భోజన వివరాలు","Meal details for selected date")}</h3><p>${T("ఆ తేదీకి ప్రత్యేకంగా వడ్డించిన వివరాలు నమోదు చేసి ఉంటే అవే ఇక్కడ కనిపిస్తాయి. లేకపోతే సాధారణ మెనూ వివరాలు కనిపిస్తాయి.","If actual or changed meal details are recorded for this date, those will appear here. Otherwise, the default menu will be shown.")}</p><div class="empty">${T("ప్రస్తుతం ఈ తేదీకి భోజన వివరాలు నమోదు కాలేదు.","No meal details have been entered for this date yet.")}</div></div><p class="meal-sponsor">${T("అదనపు ఆహారం ఉంటే దాని వివరాలు మరియు Sponsor సమాచారం ఇక్కడ చూపబడతాయి.","Additional food and sponsor details will appear here when recorded.")}</p></section>`}
function posterMarkup(){return `<section class="poster-editor"><div class="field"><label>${T("పోస్టర్ నమూనా","Poster template")}</label><select id="posterTemplate"><option value="festival">${T("పండుగ శుభాకాంక్షలు","Festival greetings")}</option><option value="birthday">${T("పుట్టినరోజు","Birthday")}</option><option value="achievement">${T("విద్యార్థి విజయం","Student achievement")}</option><option value="education">${T("విద్యా పోస్టర్","Educational poster")}</option><option value="quote">${T("ప్రేరణాత్మక సూక్తి","Inspirational quote")}</option></select></div><div class="field"><label>${T("శీర్షిక","Title")}</label><input id="posterTitle" value="${T("శుభాకాంక్షలు","Best Wishes")}"></div><div class="field"><label>${T("వివరాలు / పేరు","Details / Name")}</label><input id="posterText" value="${T("మన పాఠశాల","Our School")}"></div><div class="field"><label>${T("పాఠశాల పేరు","School name")}</label><input id="posterSchool" value="${escapeHtml(APP_CONFIG.schoolName)}"></div><div class="field"><label>${T("తేదీ","Date")}</label><input id="posterDate" type="date" value="2026-11-17"></div><div class="poster-canvas-wrap"><canvas id="posterCanvas" width="1080" height="1350"></canvas></div><div class="poster-actions"><button class="btn" id="posterPreview">${T("పోస్టర్ తయారు చేయండి","Create Poster")}</button><button class="btn secondary" id="posterDownload">${T("డౌన్‌లోడ్","Download")}</button></div><p class="demo-note">${T("పోస్టర్ మీ బ్రౌజర్‌లోనే రూపొందుతుంది; బాహ్య API లేదా Cloud Storage అవసరం లేదు.","The poster is rendered in your browser; no external API or cloud storage is used.")}</p></section>`}
function setupPosterEditor(){const canvas=document.querySelector("#posterCanvas");if(!canvas)return;const draw=()=>{const c=canvas.getContext("2d"),title=document.querySelector("#posterTitle").value||"Best Wishes",body=document.querySelector("#posterText").value||"",school=document.querySelector("#posterSchool").value||"",date=document.querySelector("#posterDate").value||"";c.clearRect(0,0,1080,1350);const g=c.createLinearGradient(0,0,1080,1350);g.addColorStop(0,"#e8f4ec");g.addColorStop(1,"#fbf3df");c.fillStyle=g;c.fillRect(0,0,1080,1350);c.strokeStyle="#34784e";c.lineWidth=18;c.strokeRect(55,55,970,1240);c.textAlign="center";c.fillStyle="#245b3d";c.font="bold 76px sans-serif";c.fillText(title.slice(0,28),540,430);c.fillStyle="#4775a4";c.font="52px sans-serif";c.fillText(body.slice(0,36),540,590);c.fillStyle="#245b3d";c.font="bold 42px sans-serif";c.fillText(school.slice(0,34),540,1050);c.font="32px sans-serif";c.fillText(date,540,1120);c.font="bold 30px sans-serif";c.fillText("A GI Creative Space work",540,1210)};draw();document.querySelector("#posterPreview").onclick=draw;["posterTitle","posterText","posterSchool","posterDate","posterTemplate"].forEach(id=>document.querySelector("#"+id).addEventListener("input",draw));document.querySelector("#posterDownload").onclick=()=>{const a=document.createElement("a");a.download="digital-mana-badi-poster.png";a.href=canvas.toDataURL("image/png");a.click()}}
function calendarMarkup(){
 const locale=state.lang==="te"?"te-IN":"en-IN";
 const first=new Date(state.selectedYear,state.selectedMonth,1),count=new Date(state.selectedYear,state.selectedMonth+1,0).getDate(),offset=first.getDay();
 const month=new Intl.DateTimeFormat(locale,{month:"long",year:"numeric"}).format(first);
 const weekdays=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(locale,{weekday:"short"}).format(new Date(2026,0,4+i)));
 const eventDays=state.selectedMonth===10&&state.selectedYear===2026?[14,17,25]:[];
 const cells=Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>{const n=i-offset+1;if(n<1||n>count)return '<span class="calendar-empty" aria-hidden="true"></span>';const d=new Date(state.selectedYear,state.selectedMonth,n);return '<button type="button" class="day '+(eventDays.includes(n)?"has-event ":"")+(state.selectedDate===n?"selected":"")+'" data-day="'+n+'" aria-label="'+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(d)+'">'+new Intl.NumberFormat(locale).format(n)+'</button>'}).join("");
 const selected=new Date(state.selectedYear,state.selectedMonth,state.selectedDate);
 const message=eventDays.includes(state.selectedDate)?T("ఈ తేదీకి సంబంధించిన అన్ని కార్యక్రమాలు క్రింద కనిపిస్తాయి.","All events for this date appear below."):T("ఈ తేదీకి కార్యక్రమాలు నమోదు కాలేదు.","No events are recorded for this date.");
 return '<div class="calendar-title"><div class="calendar-month-nav"><button type="button" class="btn secondary" id="calendarPrev" aria-label="'+T("గత నెల","Previous month")+'">‹</button><strong>'+month+'</strong><button type="button" class="btn secondary" id="calendarNext" aria-label="'+T("తదుపరి నెల","Next month")+'">›</button></div><span>'+T("కార్యక్రమ తేదీలు ప్రత్యేకంగా గుర్తించబడతాయి","Event dates are highlighted")+'</span></div><div class="calendar-grid">'+weekdays.map(d=>"<b>"+d+"</b>").join("")+cells+'</div><div class="selected-event"><strong>'+T("ఎంచుకున్న తేదీ","Selected date")+": "+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(selected)+'</strong><p>'+message+'</p></div>';
}

 return { modulePage };
}
