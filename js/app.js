import { APP_CONFIG } from "./config.js";

const state = {
  role: localStorage.getItem("gim_role") || null, view: localStorage.getItem("gim_role") ? "dashboard" : "welcome", module: null,
  theme: localStorage.getItem("gim_theme") || "light",
  lang: localStorage.getItem("gim_lang") || "te",
  selectedDate: 17, linkedStudent: null, parentLinked: false
};
const T=(te,en)=>state.lang==="te"?te:en;
const translationPairs=[["పాఠశాల వివరాలు","School Settings"],["మధ్యాహ్న భోజనం","Mid-Day Meal"],["ఈరోజు ప్రత్యేకం","Today Special"],["మన విజ్ఞాన ప్రపంచం","GI Knowledge World"],["పోస్టర్ రూపకల్పన","Poster Studio"],["గొప్ప వ్యక్తులు","Great People"],["మంచి మాటలు","Great Quotes"],["కార్యక్రమాలు మరియు క్యాలెండర్","Events & Calendar"],["రోజువారీ డైరీ","Daily Diary"],["నోటీసు బోర్డు","Notice Board"],["తల్లిదండ్రులు – విద్యార్థి అనుసంధానం","Parent–Student Linking"],["తల్లిదండ్రుల అనుసంధానం","Parent Linking"],["విద్యార్థి గుర్తింపు సంఖ్య","Student ID"],["క్రమ సంఖ్య","Roll Number"],["పుట్టిన తేదీ","Date of Birth"],["రహస్య సంకేతం","Password"],["నిర్ధారించు","Confirm"],["ప్రధాన పేజీ","Dashboard"],["ప్రధానోపాధ్యాయులు","Headmaster"],["ప్రధానోపాధ్యాయులు","Principal"],["ఉపాధ్యాయుడు","Teacher"],["తల్లిదండ్రులు","Parent"],["హాజరు","Attendance"],["ఉపాధ్యాయులు","Teachers"],["విద్యార్థులు","Students"],["ఇంటి పని","Homework"],["నోటీసులు","Notices"],["నివేదికలు","Reports"],["వ్యక్తిగత వివరాలు","Profile"],["సెట్టింగులు","Settings"],["క్యాలెండర్","Calendar"],["లాగిన్","Login"],["లాగ్ అవుట్","Logout"],["పాత్ర మార్చండి","Switch Role"],["పాత్ర","Role"],["హోమ్","Home"],["వెనక్కి","Back"],["మార్చండి","Change"],["మార్చండి","Switch"],["నోటీసు రాయండి","Create Notice"],["ఆమోదించండి","Approve"],["తిరస్కరించండి","Reject"],["ముందుగా నిర్ణయించిన భోజనం","Planned Menu"],["వడ్డించిన భోజనం","Actually Served"],["తరగతి","Class"],["విద్యార్థి","Student"],["కార్యక్రమం","Event"],["చూడటానికి మాత్రమే","View Only"],["ముందస్తు వీక్షణ","Preview Mode"],["పోస్టర్ నమూనా","Poster Preview"],["రూపకల్పన మార్చండి","Edit Design"],["బ్లాగ్ లింక్","Blog Link"],["వ్యక్తిగత వివరాలు","Personal Information"],["పాత్ర మరియు అనుమతులు","Role & Access"],["పాఠశాల వివరాలు","School Information"],["సురక్షిత లాగిన్","Secure Login"],["నిర్వాహక గుర్తింపు సంఖ్య","Admin ID"],["మీ లాగిన్ గుర్తింపు సంఖ్య నమోదు చేయండి","Enter your Login ID"],["రెండు వివరాలూ నమోదు చేయండి.","Please enter both fields."],["దయచేసి మీ పాత్రను ఎంచుకోండి","Please select your role"],["జి.ఐ. పాఠశాల నిర్వహణ వేదిక","GI SCHOOL MANAGEMENT PLATFORM"],["స్వాగతం","Welcome"],["మీ పాత్రను ఎంచుకోండి","Please select your role"],["లాగిన్ గుర్తింపు సంఖ్య","Login ID"],["రహస్య సంఖ్య / పిన్","Password / PIN"],["4 అంకెల పిన్","4-digit PIN"],["లాగిన్ అవ్వండి","Sign in"],["నమస్కారం!","Welcome!"],["పాత్ర మార్చండి","Switch Role"],["నా తరగతులు","My Classes"],["కేటాయించిన తరగతులు","Assigned Classes"],["మీ విభాగాలు","My Sections"],["ఈరోజు ప్రత్యేకం","Today Special"],["వ్యక్తిగత వివరాలు","Personal Information"],["భాష","Language"],["రంగుల అమరిక","Theme"],["తెలుపు రంగు అమరిక","Light"],["ముదురు రంగు అమరిక","Dark"],["తల్లిదండ్రుల పిన్","Parent PIN"],["విద్యార్థి వివరాలు","Student Details"],["తరగతి /","Class /"],["పుట్టిన తేదీ","DOB"],["విద్యార్థి వివరాలు నిర్ధారించండి","Verify Student Details"],["నిర్ధారించి తల్లిదండ్రులను అనుసంధానించండి","Confirm & Link Parent"],["మీ డిజిటల్ అవసరాల కోసం","For Your Digital Needs"],["సంప్రదించండి","Contact"],["జి.ఐ. ప్రధాన నిర్వాహకులు","GI Super Admin"],["అధీకృత జి.ఐ. నిర్వాహకులకు మాత్రమే","Authorized GI Administrator Only"],["రహస్య సంకేతం","Secure Password"],["హాజరు నిర్వహణ","Attendance Management"],["ఉదయం / సాయంత్రం హాజరు","Morning / Evening Attendance"],["మార్పుల చరిత్ర","Audit History"],["నెలవారీ నివేదికలు","Monthly Reports"],["రోజువారీ నివేదికలు","Daily Reports"],["ఉపాధ్యాయుల సమర్పణ","Teacher Submission"],["ప్రధానోపాధ్యాయుల పరిశీలన","HM Review"],["తల్లిదండ్రుల వీక్షణ","Parent View"],["కార్యక్రమ తేదీ గుర్తింపు","Event Date Highlight"],["ఎంచుకున్న తేదీ","Selected Date"],["ముందుగా నిర్ణయించిన భోజనం","Planned Menu"],["వడ్డించిన భోజనం","Actually Served"],["పోస్టర్ నమూనాలు","Poster Templates"],["అక్షరాలు / రంగులు / అమరిక మార్చండి","Text / Color / Layout Edit"],["ముందస్తు నమూనా","Local Preview"],["పంచుకోండి","Share"],["విభాగం","Module"],["వివరాలు చూడటానికి విభాగాన్ని తెరవండి.","Open module to view details."],["అనుమతుల ప్రకారం అందుబాటులో ఉంటుంది.","Available according to permissions."],["ఈ తేదీకి కార్యక్రమాలు నమోదు కాలేదు.","No events are recorded for this date."],["ఈ తేదీకి సంబంధించిన అన్ని కార్యక్రమాలు కింద కనిపిస్తాయి.","All events for this date appear below."],["ఇది తెరపై కనిపించే నమూనా మాత్రమే.","This is a Frontend Preview."],["నిజమైన పాఠశాల సమాచారం, లాగిన్ ధృవీకరణ, ఆమోదాల నమోదు ఇంకా ఫైర్‌బేస్‌కు అనుసంధానం కాలేదు.","Real School Data, Authentication, Approval Writes are not yet connected to Firebase."],["అనుసంధానం చేసిన తర్వాత వివరాలు కనిపిస్తాయి.","Data will appear after connection."],["విద్యార్థుల జాబితా","Student List"],["ఉపాధ్యాయుల జాబితా","Teacher List"],["విద్యార్థిని చేర్చండి","Add a new student"],["కొత్త ఉపాధ్యాయుడిని చేర్చండి","Add a new teacher"],["పాఠశాల నోటీసు","School Notice"],["పాఠశాల కార్యక్రమాలు","School Events"],["పాఠశాల సెలవులు","School Holidays"],["పుట్టినరోజు","Birthday"],["ప్రత్యేక దినాలు","Special Days"],["గొప్ప వ్యక్తులు","Great People"],["మంచి మాటలు","Great Quotes"],["జి.ఐ. బ్లాగ్ లింక్","GI Blog Link"],["బ్లాగ్ లింక్","Blog Link"],["బ్లాగ్ తెరవండి","Open Blog"],["3వ తరగతి","Class 3"],["5వ తరగతి","Class 5"],["పెండింగ్‌లో ఉన్న ఆమోదాలు","Pending Approvals"],["ఈరోజు హాజరు","Today's Attendance"],["విద్యార్థులు","Students"],["ఉపాధ్యాయులు","Teachers"],["నా పిల్లల హాజరు","My Child's Attendance"],["అనుసంధానమైన విద్యార్థి","Linked Student"],["రోజువారీ డైరీ","Daily Diary"],["పాఠశాల వివరాలు","School Information"],["పాత్ర మరియు అనుమతులు","Role & Access"],["మన భవిష్యత్తు… మన గర్వం!","Our Future… Our Pride!"],["జి.ఐ. క్రియేటివ్ స్పేస్ రూపొందించినది","A GI Creative Space work"],["గోదావరి స్ఫూర్తితో.","Inspired by Godavari."],["ప్రధానోపాధ్యాయుల ప్రధాన పేజీ","Headmaster Dashboard"],["పాఠశాల మొత్తం నిర్వహణ మరియు పర్యవేక్షణ","Complete school management and supervision"],["ఉపాధ్యాయుల ప్రధాన పేజీ","Teacher Dashboard"],["మీకు కేటాయించిన తరగతులు మరియు బోధనా పనులు","Your assigned classes and teaching tasks"],["తల్లిదండ్రుల ప్రధాన పేజీ","Parent Dashboard"],["మీ పిల్లల పాఠశాల సమాచారం","Your child's school information"],["స్వాగతం","Welcome"],["మీ పాత్రను ఎంచుకోండి","Choose your role"],["హెడ్మాస్టర్","Headmaster"],["ఉపాధ్యాయుడు","Teacher"],["తల్లిదండ్రులు","Parent"],["ప్రవేశం","Login"],["మీ పాఠశాల ఖాతా వివరాలతో ప్రవేశించండి.","Sign in using your school account details."],["మీ Student ID మరియు Parent PINతో ప్రవేశించండి.","Sign in using your Student ID and Parent PIN."],["మొదటిసారి? పిల్లలను లింక్ చేయండి","First time? Link your child"],["ముందుగా మీ పిల్లలను లింక్ చేయండి.","Please link your child first."],["Student ID లేదా PIN సరిపోలలేదు.","Student ID or PIN does not match."],["పిల్లలను లింక్ చేయండి","Link your child"],["విద్యార్థి వివరాలను నిర్ధారించి మీ Parent PIN సెట్ చేసుకోండి.","Confirm the student details and set your Parent PIN."],["తరగతి ఎంచుకోండి","Choose a class"],["డెమో విద్యార్థి","Demo Student"],["విద్యార్థి వివరాలు నిర్ధారించు","Verify student details"],["DOB నమోదు చేసి ఒకే 4-digit PIN రెండుసార్లు నమోదు చేయండి.","Enter date of birth and the same 4-digit PIN twice."],["Parent Linking పూర్తయింది.","Parent linking completed."],["నమస్కారం!","Hello!"],["నా తరగతులు","My Classes"],["మీకు కేటాయించిన తరగతులు మాత్రమే కనిపిస్తాయి.","Only your assigned classes are shown."],["లింక్ చేసిన విద్యార్థి","Linked Student"],["విద్యార్థి వివరాలు","Student Details"],["మీ విభాగాలు","Your Sections"],["మీ Roleకు అనుమతించిన సేవలు","Services available for your role"],["పుట్టినరోజులు మరియు క్యాలెండర్ ప్రత్యేక దినాలు.","Birthdays and special calendar days."],["GI నిర్వహించే ఒకే Blog Link.","One centrally managed GI blog link."],["బ్లాగ్ తెరవండి","Open Blog"],["హాజరు నిర్వహణ","Attendance Management"],["ఉదయం / సాయంత్రం Attendance","Morning / Evening Attendance"],["HM సవరణల ఆమోదం మరియు Audit History","Headmaster approvals and change history"],["తరగతి వారీగా హాజరు నివేదికలు","Class-wise attendance reports"],["ఉపాధ్యాయుల జాబితా","Teacher List"],["కొత్త ఉపాధ్యాయుడిని చేర్చండి","Add a new teacher"],["ప్రొఫైల్ మరియు కేటాయించిన తరగతులు","Profile and assigned classes"],["విద్యార్థుల జాబితా","Student List"],["విద్యార్థిని చేర్చండి","Add a student"],["Class / Roll Number నిర్వహణ","Class / Roll Number management"],["విషయాల వారీగా డైరీ","Subject-wise diary"],["HM Review → Approve / Reject","Headmaster Review → Approve / Reject"],["Parentకు Approved Diary మాత్రమే","Only approved diary is visible to parents"],["హోంవర్క్ జాబితా","Homework List"],["విషయం, తరగతి, Due Date","Subject, Class, Due Date"],["నోటీసుల జాబితా","Notice List"],["నెలవారీ క్యాలెండర్","Monthly Calendar"],["ఎంచుకున్న తేదీకి అన్ని ఈవెంట్లు","All events on the selected date"],["ప్రణాళిక మరియు వడ్డించిన భోజనం","Planned and served meals"],["పాఠశాల పోస్టర్ల రూపకల్పన","School poster design"],["పాఠశాల ప్రాథమిక సెట్టింగ్స్","Basic school settings"],["పేరు మరియు ప్రాథమిక వివరాలు","Name and basic details"],["మీకు అనుమతించిన విభాగాలు","Sections available to you"],["పాఠశాల వివరాలు","School details"],["ప్రస్తుత Session ముగించండి","End the current session"],["పాఠశాల కార్యక్రమాలు, సెలవులు","School events and holidays"],["వాస్తవంగా వడ్డించిన భోజన వివరాలు","Details of meals actually served"],["పుట్టినరోజులు, ప్రత్యేక దినాలు","Birthdays and special days"],["విద్యార్థులకు ఉపయోగకరమైన జీవిత విశేషాలు","Useful life stories for students"],["ప్రేరణాత్మక సూక్తులు","Inspirational quotes"],["పోస్టర్ తయారీ","Create a poster"],["పాఠశాల నివేదికలు","School reports"],["పాఠశాల ప్రాథమిక వివరాలు","Basic school details"],["ప్రణాళిక చేసిన మెనూ","Planned menu"],["వాస్తవంగా వడ్డించినది","Actually served"],["ఎంచుకున్న తేదీ","Selected date"],["ఈ తేదీకి సంబంధించిన అన్ని ఈవెంట్లు క్రింద కనిపిస్తాయి.","All events for this date appear below."],["ఈ తేదీకి ఈవెంట్లు నమోదు కాలేదు.","No events are recorded for this date."],["మీ డిజిటల్ అవసరాల కోసం","For Your Digital Needs"],["సంప్రదించండి","Contact"],["జి.ఐ. ప్రధాన నిర్వాహకులు","GI Super Admin"],["అధీకృత జి.ఐ. నిర్వాహకులకు మాత్రమే","Authorized GI Administrators Only"],["సురక్షిత ప్రవేశం","Secure Login"],["ముందస్తు వీక్షణ — ఫైర్‌బేస్ లాగిన్ ఇంకా అనుసంధానం కాలేదు.","Preview Mode — Firebase login is not connected yet."],["లాగిన్ గుర్తింపు సంఖ్య","Login ID"],["రహస్య సంఖ్య / పిన్","Password / PIN"],["పాత్ర మార్చండి","Switch Role"],["వెనక్కి","Back"],["హోమ్","Home"],["ప్రధాన పేజీ","Dashboard"],["భాష","Language"],["సెట్టింగులు","Settings"],["కార్యక్రమాలు మరియు క్యాలెండర్","Events & Calendar"],["నోటీసు బోర్డు","Notice Board"],["రోజువారీ డైరీ","Daily Diary"],["ఇంటి పని","Homework"],["హాజరు","Attendance"],["మధ్యాహ్న భోజనం","Mid-Day Meal"],["ఈరోజు ప్రత్యేకం","Today Special"],["గొప్ప వ్యక్తులు","Great People"],["మంచి మాటలు","Great Quotes"],["నివేదికలు","Reports"],["విద్యార్థుల జాబితా","Student List"],["ఉపాధ్యాయుల జాబితా","Teacher List"],["పాఠశాల వివరాలు","School Settings"],["కార్యక్రమాలు","Events"],["వడ్డించిన భోజనం","Served Meal"],["ముందుగా నిర్ణయించిన భోజనం","Planned Menu"],["విద్యార్థి గుర్తింపు సంఖ్య","Student ID"],["తల్లిదండ్రుల పిన్","Parent PIN"],["పుట్టిన తేదీ","Date of Birth"],["క్రమ సంఖ్య","Roll Number"],["నిర్ధారించు","Confirm"],["చూడటానికి మాత్రమే","View Only"],["పోస్టర్ నమూనా","Poster Preview"],["రూపకల్పన మార్చండి","Edit Design"],["నిష్క్రమణ","Logout"],["ఆమోదించండి","Approve"],["తిరస్కరించండి","Reject"],["గొప్ప మాటలు","Great Quotes"],["పాత్ర","Role"],["వ్యక్తిగత వివరాలు","Profile"],["అనుమతులు","Permissions"],["క్యాలెండర్","Calendar"],["సురక్షిత లాగిన్","Secure Login"],["స్వాగతం!","Welcome!"],["మీ పిల్లల హాజరు","My Child's Attendance"],["లాగిన్","Login"],["ఈరోజు హాజరు","Today's Attendance"],["పెండింగ్ ఆమోదాలు","Pending Approvals"],["ప్రధానోపాధ్యాయుల పరిశీలన","Headmaster Review"],["నెలవారీ నివేదికలు","Monthly Reports"],["రోజువారీ నివేదికలు","Daily Reports"],["పాఠశాల కార్యక్రమాలు","School Events"],["పాఠశాల సెలవులు","School Holidays"],["పిల్లలను అనుసంధానించండి","Link your child"]];
function translateValue(value){
 const direction=state.lang==="te"?0:1;
 const sorted=[...translationPairs].sort((a,b)=>b[1-direction].length-a[1-direction].length);
 let out=String(value??"");
 for(const pair of sorted){const from=pair[1-direction],to=pair[direction];if(from)out=out.split(from).join(to)}
 return out;
}
function applyTranslations(){
 const walk=node=>{for(const child of [...node.childNodes]){if(child.nodeType===3)child.nodeValue=translateValue(child.nodeValue);else if(child.nodeType===1){for(const attr of ["placeholder","title","aria-label"])if(child.hasAttribute(attr))child.setAttribute(attr,translateValue(child.getAttribute(attr)));walk(child)}}};
 walk(document.querySelector("#app"));
 document.documentElement.lang=state.lang;
}

const roleNames={hm:["ప్రధానోపాధ్యాయులు","Headmaster"],teacher:["ఉపాధ్యాయుడు","Teacher"],parent:["తల్లిదండ్రులు","Parent"]};
const roleMeta={
 hm:{tone:"green",icon:"school",title:"ప్రధానోపాధ్యాయుల ప్రధాన పేజీ",sub:"పాఠశాల మొత్తం నిర్వహణ మరియు పర్యవేక్షణ"},
 teacher:{tone:"gold",icon:"presentation",title:"ఉపాధ్యాయుల ప్రధాన పేజీ",sub:"మీకు కేటాయించిన తరగతులు మరియు బోధనా పనులు"},
 parent:{tone:"blue",icon:"users",title:"తల్లిదండ్రుల ప్రధాన పేజీ",sub:"మీ పిల్లల పాఠశాల సమాచారం"}
};
const modules={
 hm:[
  ["calendar-check","హాజరు","Attendance","ఉదయం / సాయంత్రం హాజరు, సవరణల ఆమోదం"],
  ["users","ఉపాధ్యాయులు","Teachers","ఉపాధ్యాయుల వివరాలు, తరగతుల కేటాయింపు"],
  ["graduation-cap","విద్యార్థులు","Students","విద్యార్థుల వివరాలు, తరగతి / రోల్ నిర్వహణ"],
  ["notebook-pen","డైలీ డైరీ","Daily Diary","విషయాల వారీగా సమర్పణలు, ఆమోదాలు"],
  ["book-open","హోంవర్క్","Homework","హోంవర్క్ నిర్వహణ, సమర్పణలు"],
  ["megaphone","నోటీసు బోర్డు","Notice Board","నోటీసుల పరిశీలన, ఆమోదం, ప్రచురణ"],
  ["calendar-days","ఈవెంట్స్ & క్యాలెండర్","Events & Calendar","పాఠశాల కార్యక్రమాలు, సెలవులు"],
  ["utensils","మధ్యాహ్న భోజనం","Mid-Day Meal","ప్రణాళిక మరియు వడ్డించిన భోజనం"],
  ["sun","Today Special","Today Special","పుట్టినరోజులు, ప్రత్యేక దినాలు"],
  ["book-heart","గొప్ప వ్యక్తులు","Great People","విద్యార్థులకు ఉపయోగకరమైన జీవిత విశేషాలు"],
  ["quote","గొప్ప మాటలు","Great Quotes","ప్రేరణాత్మక సూక్తులు"],
  ["globe","మన విజ్ఞాన ప్రపంచం","GI Knowledge World","GI నిర్వహించే Blog Link"],
  ["palette","Poster Studio","Poster Studio","పాఠశాల పోస్టర్ల రూపకల్పన"],
  ["chart-no-axes-column","రిపోర్ట్స్","Reports","పాఠశాల నివేదికలు"],
  ["settings","పాఠశాల సెట్టింగ్స్","School Settings","పాఠశాల ప్రాథమిక సెట్టింగ్స్"]
 ],
 teacher:[
  ["calendar-check","హాజరు","Attendance","కేటాయించిన తరగతులకు ఉదయం / సాయంత్రం హాజరు"],
  ["notebook-pen","డైలీ డైరీ","Daily Diary","విషయాల వారీగా డైరీ నమోదు, సమర్పణ"],
  ["book-open","హోంవర్క్","Homework","విద్యార్థులకు హోంవర్క్ ఇవ్వడం"],
  ["megaphone","నోటీసులు","Notices","పాఠశాల నోటీసులు చూడటం"],
  ["calendar-days","ఈవెంట్స్ & క్యాలెండర్","Events & Calendar","పాఠశాల కార్యక్రమాలు చూడటం"],
  ["utensils","మధ్యాహ్న భోజనం","Mid-Day Meal","కేటాయించిన నమోదు / పరిశీలన"],
  ["sun","Today Special","Today Special","పుట్టినరోజులు, ప్రత్యేక దినాలు"],
  ["book-heart","గొప్ప వ్యక్తులు","Great People","View Only"],
  ["quote","గొప్ప మాటలు","Great Quotes","View Only"],
  ["globe","మన విజ్ఞాన ప్రపంచం","GI Knowledge World","GI Blog Link"],
  ["palette","Poster Studio","Poster Studio","పోస్టర్ తయారీ"]
 ],
 parent:[
  ["calendar-check","నా పిల్లల హాజరు","Attendance","రోజువారీ మరియు నెలవారీ హాజరు"],
  ["notebook-pen","డైలీ డైరీ","Daily Diary","HM ఆమోదించిన డైరీ మాత్రమే"],
  ["book-open","హోంవర్క్","Homework","ఇచ్చిన హోంవర్క్ వివరాలు"],
  ["megaphone","నోటీసులు","Notices","పాఠశాల ఆమోదించిన నోటీసులు"],
  ["calendar-days","ఈవెంట్స్ & క్యాలెండర్","Events & Calendar","పాఠశాల కార్యక్రమాలు, సెలవులు"],
  ["utensils","మధ్యాహ్న భోజనం","Mid-Day Meal","వాస్తవంగా వడ్డించిన భోజన వివరాలు"],
  ["sun","Today Special","Today Special","పుట్టినరోజులు, ప్రత్యేక దినాలు"],
  ["globe","మన విజ్ఞాన ప్రపంచం","GI Knowledge World","GI Blog Link"]
 ]
};
const main=document.querySelector("#mainView");
document.documentElement.dataset.theme=state.theme;
const iconSvg=(name)=>({school:"▦",presentation:"▤",users:"♧", "calendar-check":"▣","notebook-pen":"✎","book-open":"▤",megaphone:"◖", "calendar-days":"▦",utensils:"♨",sun:"☼","book-heart":"♡",quote:"❝",globe:"◎",palette:"▧","chart-no-axes-column":"▥",settings:"⚙","graduation-cap":"⌂",bell:"♢",user:"○",shield:"⬡"}[name]||"•");
function toggleLanguage(){
 state.lang=state.lang==="te"?"en":"te";
 localStorage.setItem("gim_lang",state.lang);
 render();
}
function toggleTheme(){
 state.theme=state.theme==="light"?"dark":"light";
 localStorage.setItem("gim_theme",state.theme);
 document.documentElement.dataset.theme=state.theme;
 render();
}
document.querySelector("#languageToggle").onclick=toggleLanguage;
document.querySelector("#themeToggle").onclick=toggleTheme;
document.querySelector("#brandHome").onclick=()=>{state.view=state.role?"dashboard":"welcome";render()};
function welcome(){
 main.innerHTML=`<section class="welcome-panel"><div class="welcome-emblem" aria-label="ప్రభుత్వ చిహ్నం త్వరలో జోడించబడుతుంది"></div><div class="welcome-kicker">GI SCHOOL MANAGEMENT PLATFORM</div><h1>${T("స్వాగతం","Welcome")}</h1><p>${T("మీ పాత్రను ఎంచుకోండి","Please select your role")}</p></section>
 <section class="role-stack">
 ${roleCard("school","హెడ్మాస్టర్","Headmaster","hm","green")}
 ${roleCard("presentation","ఉపాధ్యాయుడు","Teacher","teacher","gold")}
 ${roleCard("users","తల్లిదండ్రులు","Parent","parent","blue")}
 </section>`;
 main.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{state.role=b.dataset.role;localStorage.setItem("gim_role",state.role);state.view="login";render()});
}
function roleCard(ic,te,en,role,tone){return `<button class="role-card role-${tone}" data-role="${role}"><span class="role-icon">${iconSvg(ic)}</span><span class="role-copy"><strong>${T(te,en)}</strong><small>${roleNames[role][1]}</small></span><span class="role-arrow">›</span></button>`}
function login(){
 const role=roleNames[state.role], parent=state.role==="parent";
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="backWelcome">← ${T("వెనక్కి","Back")}</button><span class="pill">${T(role[0],role[1])}</span></div>
 <section class="form-card"><div class="login-symbol">${iconSvg(roleMeta[state.role].icon)}</div><h2>${T(role[0]+" లాగిన్",role[1]+" Login")}</h2><p>${parent?T("మీ Student ID మరియు Parent PINతో ప్రవేశించండి.","Sign in with your Student ID and Parent PIN."):T("మీ పాఠశాల ఖాతా వివరాలతో ప్రవేశించండి.","Sign in with your school account credentials.")}</p>
 ${parent?'<div class="field"><label>Student ID</label><input id="loginId" placeholder="Student ID"></div><div class="field"><label>Parent PIN</label><input id="loginPin" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit PIN"></div><button class="btn full" id="loginGo">Login</button><div class="link-row"><button class="text-link" id="startLink">మొదటిసారి? పిల్లలను లింక్ చేయండి</button></div>':
 '<div class="field"><label>'+T("Login ID","Login ID")+'</label><input id="loginId" placeholder="'+T("మీ Login ID","Enter your Login ID")+'"></div><div class="field"><label>'+T("Password / PIN","Password / PIN")+'</label><input id="loginPin" type="password" placeholder="••••••••"></div><button class="btn full" id="loginGo">'+T("Login","Login")+'</button><div class="demo-note">Preview Mode — Firebase Authentication ఇంకా అనుసంధానం కాలేదు.</div>'}
 </section>`;
 document.querySelector("#backWelcome").onclick=()=>{state.role=null;localStorage.removeItem("gim_role");state.view="welcome";render()};
 if(parent)document.querySelector("#startLink").onclick=()=>{state.view="link";render()};
 document.querySelector("#loginGo").onclick=()=>{
  const id=document.querySelector("#loginId").value.trim(),pin=document.querySelector("#loginPin").value.trim();
  if(APP_CONFIG.demoMode && !id && !pin){state.view="dashboard";render();return}
  if(!id||!pin){toast(T("రెండు వివరాలు నమోదు చేయండి.","Please enter both fields."));return}
  if(parent&&!state.parentLinked){toast("ముందుగా మీ పిల్లలను లింక్ చేయండి.");return}
  if(parent&&(id!==state.linkedStudent?.id||pin!==state.linkedStudent?.pin)){toast("Student ID లేదా PIN సరిపోలలేదు.");return}
  state.view="dashboard";render();
 };
}
function linking(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="linkBack">← వెనక్కి</button></div><section class="form-card"><div class="login-symbol">♧</div><h2>Parent–Student Linking</h2><p>విద్యార్థి వివరాలను నిర్ధారించి మీ Parent PIN సెట్ చేసుకోండి.</p>
 <div class="stepper"><span class="active">1. వివరాలు</span><span>2. DOB</span><span>3. PIN</span></div>
 <div class="field"><label>Class / తరగతి</label><select id="linkClass"><option value="">తరగతి ఎంచుకోండి</option>${Array.from({length:10},(_,i)=>'<option>Class '+(i+1)+'</option>').join("")}</select></div>
 <div class="field"><label>Student ID</label><input id="studentId" placeholder="Student ID"></div>
 <div class="field"><label>Roll Number</label><input id="rollNo" placeholder="Roll Number"></div>
 <button class="btn full" id="verifyStudent">విద్యార్థి వివరాలు నిర్ధారించు</button>
 <div id="studentVerifyArea"></div></section>`;
 document.querySelector("#linkBack").onclick=()=>{state.view="login";render()};
 document.querySelector("#verifyStudent").onclick=()=>{
  const cls=document.querySelector("#linkClass").value,id=document.querySelector("#studentId").value.trim(),roll=document.querySelector("#rollNo").value.trim();
  if(!cls||!id||!roll){toast("Class, Student ID, Roll Number నమోదు చేయండి.");return}
  document.querySelector("#studentVerifyArea").innerHTML=`<div class="verified-student"><strong>విద్యార్థి వివరాలు</strong><p>డెమో విద్యార్థి • ${cls} • Roll No: ${escapeHtml(roll)}</p><div class="field"><label>Date of Birth</label><input id="studentDob" type="date"></div><div class="field"><label>మీ 4-digit Parent PIN సెట్ చేయండి</label><input id="newParentPin" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit PIN"></div><div class="field"><label>Confirm Parent PIN</label><input id="confirmParentPin" type="password" inputmode="numeric" maxlength="4" placeholder="మళ్లీ PIN నమోదు చేయండి"></div><button class="btn full" id="completeLink">Confirm & Link Parent</button></div>`;
  document.querySelector("#completeLink").onclick=()=>{
   const dob=document.querySelector("#studentDob").value,pin=document.querySelector("#newParentPin").value,confirm=document.querySelector("#confirmParentPin").value;
   if(!dob||!/^[0-9]{4}$/.test(pin)||pin!==confirm){toast("DOB నమోదు చేసి ఒకే 4-digit PIN రెండుసార్లు నమోదు చేయండి.");return}
   state.linkedStudent={id,roll,className:cls,pin};state.parentLinked=true;toast("Parent Linking పూర్తయింది.");state.view="login";render();
  };
 };
}
function dashboard(){
 const meta=roleMeta[state.role],list=modules[state.role]||[];
 main.innerHTML=`<div class="dashboard-head"><div><span class="pill">${T("నమస్కారం!","Welcome!")}</span><h1>${T(meta.title,meta.title)}</h1><p>${T(meta.sub,meta.sub)}</p></div><div class="dashboard-actions"><button class="btn secondary" id="switchRoleHome">${T("Role మార్చు","Switch Role")}</button><button class="btn secondary" id="profileBtn">◉ ${T("ప్రొఫైల్","Profile")}</button></div></div>
 ${state.role==="hm"?'<section class="stats-grid"><article class="stat-card"><strong>—</strong><span>విద్యార్థులు</span></article><article class="stat-card"><strong>—</strong><span>ఉపాధ్యాయులు</span></article><article class="stat-card"><strong>—</strong><span>ఈరోజు హాజరు</span></article><article class="stat-card"><strong>—</strong><span>పెండింగ్ ఆమోదాలు</span></article></section>':""}
 ${state.role==="teacher"?'<section class="card assigned"><h3>నా తరగతులు</h3><p>మీకు కేటాయించిన తరగతులు మాత్రమే కనిపిస్తాయి.</p><div class="chips"><span>Class 3</span><span>Class 5</span></div></section>':""}
 ${state.role==="parent"?'<section class="feature-card blue parent-student"><div class="card-icon">♙</div><div><h3>లింక్ చేసిన విద్యార్థి</h3><p>'+(state.linkedStudent?escapeHtml(state.linkedStudent.className+" • Roll "+state.linkedStudent.roll):"విద్యార్థి వివరాలు")+'</p></div></section>':""}
 <div class="section-head"><div><h2>మీ విభాగాలు</h2><p>మీ Roleకు అనుమతించిన సేవలు</p></div></div><section class="module-grid">${list.map(m=>`<button class="module-card" data-module="${m[2]}"><span class="card-icon">${iconSvg(m[0])}</span><strong>${m[1]}</strong><small>${m[3]}</small><span class="module-arrow">›</span></button>`).join("")}</section>
 ${commonHighlights()}
 <nav class="bottom-nav"><button class="active" id="navHome">⌂<small>Home</small></button><button id="navCalendar">▦<small>Calendar</small></button><button id="navProfile">◉<small>Profile</small></button><button id="navSettings">⚙<small>Settings</small></button></nav>`;
 main.querySelectorAll("[data-module]").forEach(b=>b.onclick=()=>{state.module=b.dataset.module;state.view="module";render()});
 document.querySelector("#switchRoleHome").onclick=()=>{state.role=null;localStorage.removeItem("gim_role");state.view="welcome";render()};
 document.querySelector("#profileBtn").onclick=()=>{state.view="profile";render()};
 document.querySelector("#navProfile").onclick=()=>{state.view="profile";render()};
 document.querySelector("#navSettings").onclick=()=>{state.view="settings";render()};
 document.querySelector("#navCalendar").onclick=()=>{state.module="Events & Calendar";state.view="module";render()};
 document.querySelector("#navHome").onclick=()=>{state.view="dashboard";render()};
}
function commonHighlights(){return `<section class="today-grid"><article class="card"><h3>☼ Today Special</h3><p>పుట్టినరోజులు మరియు క్యాలెండర్ ప్రత్యేక దినాలు.</p><div class="empty">డేటా అనుసంధానం తర్వాత నిజమైన వివరాలు కనిపిస్తాయి.</div></article><article class="feature-card blue"><div class="card-icon">◎</div><h3>మన విజ్ఞాన ప్రపంచం</h3><p>GI నిర్వహించే ఒకే Blog Link.</p><a href="${APP_CONFIG.knowledgeBlogUrl}" target="_blank" rel="noopener">బ్లాగ్ తెరవండి ↗</a></article></section>`}
function modulePage(){
 const title=state.module||"Module";
 const cfg={
 "Attendance":["హాజరు నిర్వహణ","ఉదయం / సాయంత్రం Attendance","HM సవరణల ఆమోదం మరియు Audit History","తరగతి వారీగా హాజరు నివేదికలు"],
 "Teachers":["ఉపాధ్యాయుల జాబితా","కొత్త ఉపాధ్యాయుడిని చేర్చండి","ప్రొఫైల్ మరియు కేటాయించిన తరగతులు"],
 "Students":["విద్యార్థుల జాబితా","విద్యార్థిని చేర్చండి","Class / Roll Number నిర్వహణ"],
 "Daily Diary":["విషయాల వారీగా డైరీ","Teacher Submission","HM Review → Approve / Reject","Parentకు Approved Diary మాత్రమే"],
 "Homework":["హోంవర్క్ జాబితా","విషయం, తరగతి, Due Date","Parent View"],
 "Notice Board":["నోటీసుల జాబితా","Create Notice","HM Approval → Publish"],
 "Events & Calendar":["నెలవారీ క్యాలెండర్","Event Date Highlight","ఎంచుకున్న తేదీకి అన్ని ఈవెంట్లు"],
 "Mid-Day Meal":["Planned Menu","Actually Served","రోజువారీ రికార్డ్"],
 "Today Special":["పుట్టినరోజులు","జాతీయ / అంతర్జాతీయ ప్రత్యేక దినాలు","పాఠశాల ప్రత్యేకతలు"],
 "Great People":["గొప్ప వ్యక్తుల జాబితా","HM నిర్వహణ","Teacher / Parent View Only"],
 "Great Quotes":["గొప్ప మాటలు","HM నిర్వహణ","Teacher / Parent View Only"],
 "GI Knowledge World":["మన విజ్ఞాన ప్రపంచం","ఒకే GI Blog Link","వ్యాసాలు యాప్‌లో నిల్వ చేయబడవు"],
 "Poster Studio":["Poster Templates","Text / Color / Layout Edit","Local Preview → Share"],
 "Reports":["రోజువారీ నివేదికలు","నెలవారీ నివేదికలు","Attendance Summary"],
 "School Settings":["పాఠశాల ప్రాథమిక వివరాలు","అనుమతులు మరియు సెట్టింగ్స్"]
 }[title]||["విభాగ వివరాలు","డెమో సమాచారం","ఈ స్క్రీన్ UI Preview దశలో ఉంది"];
 const calendar=title==="Events & Calendar";
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail"><h2>${escapeHtml(title)}</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>
 ${calendar?calendarMarkup():""}
 <div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>
 ${title==="Mid-Day Meal"?'<div class="split-panels"><div class="feature-card gold"><h3>Planned Menu</h3><p>ప్రణాళిక చేసిన మెనూ</p></div><div class="feature-card green"><h3>Actually Served</h3><p>వాస్తవంగా వడ్డించినది</p></div></div>':""}
 ${title==="Poster Studio"?'<div class="poster-demo"><div><strong>పాఠశాల కార్యక్రమం</strong><small>Poster Preview</small></div><button class="btn secondary" id="posterEdit">Edit Design</button></div>':""}
 <div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div></section>`;
 document.querySelector("#moduleBack").onclick=()=>{state.view="dashboard";render()};
 main.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDate=Number(b.dataset.day);render()});
 const edit=document.querySelector("#posterEdit");if(edit)edit.onclick=()=>toast("Poster Editor UI తదుపరి Previewలో విస్తరిస్తాం.");
}
function calendarMarkup(){
 const days=["ఆ","సో","మం","బు","గు","శు","శ"];
 return `<div class="calendar-title"><strong>నవంబర్ 2026</strong><span>ఈవెంట్ తేదీలు ప్రత్యేకంగా గుర్తించబడతాయి</span></div><div class="calendar-grid">${days.map(d=>'<b>'+d+'</b>').join("")}${Array.from({length:35},(_,i)=>{const n=i-5;return n<1||n>30?'<span></span>':'<button class="day '+([14,17,25].includes(n)?"has-event ":"")+(state.selectedDate===n?"selected":"")+'" data-day="'+n+'">'+n+'</button>'}).join("")}</div><div class="selected-event"><strong>ఎంచుకున్న తేదీ: ${state.selectedDate} నవంబర్</strong><p>${[14,17,25].includes(state.selectedDate)?"ఈ తేదీకి సంబంధించిన అన్ని ఈవెంట్లు క్రింద కనిపిస్తాయి.":"ఈ తేదీకి ఈవెంట్లు నమోదు కాలేదు."}</p></div>`;
}
function profilePage(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="profileBack">← Dashboard</button></div><section class="form-card"><div class="login-symbol">◉</div><h2>Profile</h2><p>${roleNames[state.role][0]} • ${APP_CONFIG.schoolName}</p><div class="detail-list"><div class="detail-row"><div><strong>Personal Information</strong><small>పేరు మరియు ప్రాథమిక వివరాలు</small></div>›</div><div class="detail-row"><div><strong>Role & Access</strong><small>మీకు అనుమతించిన విభాగాలు</small></div>›</div><div class="detail-row"><div><strong>School Information</strong><small>పాఠశాల వివరాలు</small></div>›</div></div></section>`;
 document.querySelector("#profileBack").onclick=()=>{state.view="dashboard";render()};
}
function settingsPage(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="settingsBack">← Dashboard</button></div><section class="card module-detail"><h2>Settings</h2><div class="detail-list"><div class="detail-row"><div><strong>Language</strong><small>తెలుగు / English</small></div><button class="btn secondary" id="settingsLang">Change</button></div><div class="detail-row"><div><strong>Theme</strong><small>Light / Dark</small></div><button class="btn secondary" id="settingsTheme">Change</button></div><div class="detail-row"><div><strong>Switch Role</strong><small>Welcome Screen‌కు తిరిగి వెళ్లండి</small></div><button class="btn secondary" id="switchRole">Switch</button></div><div class="detail-row"><div><strong>Logout</strong><small>ప్రస్తుత Session ముగించండి</small></div><button class="btn danger" id="logout">Logout</button></div></div></section>`;
 document.querySelector("#settingsBack").onclick=()=>{state.view="dashboard";render()};
 document.querySelector("#settingsLang").onclick=toggleLanguage;
 document.querySelector("#settingsTheme").onclick=toggleTheme;
 document.querySelector("#switchRole").onclick=()=>{state.role=null;localStorage.removeItem("gim_role");state.view="welcome";render()};
 document.querySelector("#logout").onclick=()=>{state.role=null;state.view="login";render()};
}
function superAdmin(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="superBack">← Back</button></div><section class="form-card super-card"><div class="login-symbol">⬡</div><h2>GI Super Admin</h2><p>Authorized GI Administrator Only</p><div class="field"><label>Admin ID</label><input placeholder="Admin ID"></div><div class="field"><label>Secure Password</label><input type="password" placeholder="••••••••"></div><button class="btn full" id="superContinue">Secure Login</button><div class="demo-note">Authentication placeholder — secure backend ఇంకా అనుసంధానం కాలేదు.</div></section>`;
 document.querySelector("#superBack").onclick=()=>{state.view="welcome";render()};
 document.querySelector("#superContinue").onclick=()=>toast("GI Super Admin Authentication ఇంకా సిద్ధం కాలేదు.");
}
function contactPopup(){
 const modal=document.createElement("div");modal.className="modal-backdrop";modal.innerHTML='<section class="contact-popover"><button class="modal-close">×</button><h2>For Your Digital Needs</h2><p>Contact</p><a class="whatsapp-link" href="https://wa.me/918985361991" target="_blank" rel="noopener">◉</a></section>';document.body.append(modal);
 modal.querySelector(".modal-close").onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};
}
function setupFooter(){
 const sig=document.querySelector("#footerSignature"),inspired=document.querySelector("#footerInspired");let timer=null,long=false;
 inspired.onclick=contactPopup;sig.onclick=e=>{if(long){e.preventDefault();long=false;return}contactPopup()};
 sig.onpointerdown=()=>{long=false;timer=setTimeout(()=>{long=true;state.view="superadmin";render()},850)};
 ["pointerup","pointerleave","pointercancel"].forEach(ev=>sig.addEventListener(ev,()=>clearTimeout(timer)));
}
function toast(msg){const el=document.createElement("div");el.className="toast";el.textContent=translateValue(msg);document.body.append(el);setTimeout(()=>el.remove(),2400)}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 document.querySelector("#appName").textContent=state.lang==="te"?APP_CONFIG.appNameTe:APP_CONFIG.appNameEn;
 document.querySelector("#tagline").textContent=state.lang==="te"?APP_CONFIG.taglineTe:APP_CONFIG.taglineEn;
 const theme=document.querySelector("#themeToggle");theme.textContent=state.theme==="light"?"☾":"☀";
 document.querySelector("#languageToggle").textContent=state.lang==="te"?"అ":"A";
 document.querySelector("#languageToggle").setAttribute("aria-label",state.lang==="te"?"Switch to English":"తెలుగులోకి మార్చండి");
 theme.setAttribute("aria-label",state.theme==="light"?"Switch to dark theme":"Switch to light theme");
 if(state.view==="welcome")welcome();else if(state.view==="login")login();else if(state.view==="link")linking();else if(state.view==="dashboard")dashboard();else if(state.view==="module")modulePage();else if(state.view==="profile")profilePage();else if(state.view==="settings")settingsPage();else if(state.view==="superadmin")superAdmin();
 applyTranslations();
}
render();setupFooter();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
