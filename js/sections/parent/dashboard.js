export function renderParentDashboardIntro({state,escapeHtml,T}) {
 if(state.role!=="parent") return "";
 const t=(te,en)=>T?T(te,en):te;
 const esc=value=>escapeHtml?escapeHtml(String(value??"")):String(value??"");
 const classTitle=value=>{const match=/^class-([1-5])$/.exec(String(value||""));return match?t(match[1]+"వ తరగతి","Class "+match[1]):String(value||"")};
 const children=Array.isArray(state.parentChildren)&&state.parentChildren.length?state.parentChildren:(state.linkedStudent?[state.linkedStudent]:[]);
 const now=new Date();
 const hour=now.getHours();
 const greeting=hour<12?t("శుభోదయం","Good morning"):hour<16?t("శుభ మధ్యాహ్నం","Good afternoon"):hour<20?t("శుభ సాయంత్రం","Good evening"):t("శుభరాత్రి","Good night");
 const parentName=String(state.parentName||localStorage.getItem("gim_parent_name")||"").trim();
 const salutation=parentName?t("గౌరవనీయులైన ","Dear ")+esc(parentName)+t(" గారికి",""):t("గౌరవనీయులైన తల్లిదండ్రులకు","Dear Parent");
 const quotes=[
  [t("పిల్లల కలలకు తొలి బలం… తల్లిదండ్రుల ప్రోత్సాహం.","A child's dreams grow stronger with a parent's encouragement."),t("ప్రతి చిన్న ప్రోత్సాహం… పిల్లల భవిష్యత్తులో ఒక పెద్ద అడుగు.","Every little encouragement is a big step toward a child's future.")],
  [t("విద్య అనేది మార్కులకే కాదు… మంచి మనిషిగా ఎదగడానికి కూడా.","Education is not only about marks; it is about becoming a good human being."),t("ఈ రోజు నేర్చుకున్న చిన్న విషయం… రేపటి విజయానికి పునాది.","What is learned today becomes the foundation for tomorrow's success.")],
  [t("పిల్లలతో గడిపే సమయం… వారికి ఇచ్చే అమూల్యమైన బహుమతి.","Time spent with children is one of the most precious gifts.") ,t("ప్రశ్నించే పిల్లలే… కొత్త ప్రపంచాన్ని నిర్మిస్తారు.","Curious children are the ones who build a new world.")]
 ];
 const quote=quotes[Math.floor(now.getDate()/3)%quotes.length][state.lang==="en"?1:0];
 const dateTime=new Intl.DateTimeFormat(state.lang==="en"?"en-IN":"te-IN",{dateStyle:"full",timeStyle:"short"}).format(now);
 return '<section class="parent-welcome-card" style="margin:0 0 20px;padding:20px;border:1px solid var(--border);border-radius:20px;background:linear-gradient(135deg,var(--surface),var(--surface2));"><div style="font-size:13px;font-weight:750;color:var(--green);letter-spacing:.03em">'+greeting+'</div><h2 style="margin:7px 0 4px;font-size:clamp(20px,4vw,27px)">'+salutation+'</h2><div style="font-size:12px;color:var(--muted)">'+esc(dateTime)+'</div><blockquote style="margin:16px 0 0;padding:12px 14px;border-left:3px solid var(--green);background:var(--surface);border-radius:0 12px 12px 0;font-size:14px;line-height:1.7">“'+quote+'”</blockquote></section><section class="feature-card blue parent-student"><div class="card-icon">♙</div><div><h3>'+t("లింక్ చేసిన విద్యార్థులు","Linked Students")+'</h3><p>'+t("మీ ఖాతాకు అనుసంధానమైన పిల్లల వివరాలు","Children connected to your Parent account")+'</p>'+
 (children.length?'<div class="parent-children-list">'+children.map(child=>'<div class="parent-child-item"><strong>'+esc(child.name||t("విద్యార్థి","Student"))+'</strong><span>'+esc(classTitle(child.classId||child.className||""))+' · '+t("రోల్ నంబర్","Roll Number")+' '+esc(child.rollNumber||"")+'</span><small>'+t("విద్యార్థి ID: ","Student ID: ")+esc(child.studentId||child.id||"")+'</small></div>').join("")+'</div>':t("ఇంకా విద్యార్థులు అనుసంధానం కాలేదు.","No students are linked yet."))+
 '</div><button type="button" class="btn secondary" id="parentAddChild" style="margin-top:14px">'+t("మరొక పిల్లవాడిని జోడించండి","Add Your Child")+'</button></section>';
}
