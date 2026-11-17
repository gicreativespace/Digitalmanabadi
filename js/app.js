import { APP_CONFIG } from "./config.js";

const savedRole = localStorage.getItem("gim_role") || null;
const savedAuth = localStorage.getItem("gim_authenticated") === "true";
const state = {
  role: savedRole, authenticated: Boolean(savedRole && savedAuth),
  view: savedRole && savedAuth ? "dashboard" : savedRole ? "login" : "welcome", module: null,
  theme: localStorage.getItem("gim_theme") || "light",
  lang: localStorage.getItem("gim_lang") || "te",
  selectedDate: 17, selectedMonth: 10, selectedYear: 2026, linkedStudent: null, parentLinked: false
};
const T=(te,en)=>state.lang==="te"?te:en;
const translationPairs=[["పాఠశాల వివరాలు","School Settings"],["మధ్యాహ్న భోజనం","Mid-Day Meal"],["ఈరోజు ప్రత్యేకం","Today Special"],["మన విజ్ఞాన ప్రపంచం","GI Knowledge World"],["పోస్టర్ రూపకల్పన","Poster Studio"],["గొప్ప వ్యక్తులు","Great People"],["మంచి మాటలు","Great Quotes"],["కార్యక్రమాలు మరియు క్యాలెండర్","Events & Calendar"],["రోజువారీ డైరీ","Daily Diary"],["నోటీసు బోర్డు","Notice Board"],["తల్లిదండ్రులు – విద్యార్థి అనుసంధానం","Parent–Student Linking"],["తల్లిదండ్రుల అనుసంధానం","Parent Linking"],["విద్యార్థి గుర్తింపు సంఖ్య","Student ID"],["క్రమ సంఖ్య","Roll Number"],["పుట్టిన తేదీ","Date of Birth"],["రహస్య సంకేతం","Password"],["నిర్ధారించు","Confirm"],["ప్రధాన పేజీ","Dashboard"],["ప్రధానోపాధ్యాయులు","Head Master"],["ప్రధానోపాధ్యాయులు","Head Master"],["ఉపాధ్యాయుడు","Teacher"],["తల్లిదండ్రులు","Parent"],["హాజరు","Attendance"],["ఉపాధ్యాయులు","Teachers"],["విద్యార్థులు","Students"],["ఇంటి పని","Homework"],["డైలీ డైరీ","Daily Diary"],["హోంవర్క్","Homework"],["విషయాల వారీగా డైరీ","Subject-wise Diary"],["విషయాల వారీగా డైరీ నమోదు, సమర్పణ","Subject-wise diary entry and submission"],["విషయాల వారీగా సమర్పణలు, ఆమోదాలు","Subject-wise submissions and approvals"],["హోంవర్క్ నిర్వహణ, సమర్పణలు","Homework management and submissions"],["హోంవర్క్ జాబితా","Homework List"],["విద్యార్థులకు హోంవర్క్ ఇవ్వడం","Assign homework to students"],["విషయం, తరగతి, Due Date","Subject, Class, Due Date"],["ఇచ్చిన హోంవర్క్ వివరాలు","Assigned homework details"],["HM ఆమోదించిన డైరీ మాత్రమే","Only HM-approved diary"],["పాఠశాల ఆమోదించిన నోటీసులు","School-approved notices"],["నోటీసు బోర్డు","Notice Board"],["నివేదికలు","Reports"],["వ్యక్తిగత వివరాలు","Profile"],["సెట్టింగులు","Settings"],["క్యాలెండర్","Calendar"],["లాగిన్","Login"],["లాగ్ అవుట్","Logout"],["పాత్ర మార్చండి","Switch Role"],["పాత్ర","Role"],["హోమ్","Home"],["వెనక్కి","Back"],["మార్చండి","Change"],["మార్చండి","Switch"],["నోటీసు రాయండి","Create Notice"],["ఆమోదించండి","Approve"],["తిరస్కరించండి","Reject"],["ముందుగా నిర్ణయించిన భోజనం","Planned Menu"],["వడ్డించిన భోజనం","Actually Served"],["తరగతి","Class"],["విద్యార్థి","Student"],["కార్యక్రమం","Event"],["చూడటానికి మాత్రమే","View Only"],["ముందస్తు వీక్షణ","Preview Mode"],["పోస్టర్ నమూనా","Poster Preview"],["రూపకల్పన మార్చండి","Edit Design"],["బ్లాగ్ లింక్","Blog Link"],["వ్యక్తిగత వివరాలు","Personal Information"],["పాత్ర మరియు అనుమతులు","Role & Access"],["పాఠశాల వివరాలు","School Information"],["సురక్షిత లాగిన్","Secure Login"],["నిర్వాహక గుర్తింపు సంఖ్య","Admin ID"],["మీ లాగిన్ గుర్తింపు సంఖ్య నమోదు చేయండి","Enter your Login ID"],["రెండు వివరాలూ నమోదు చేయండి.","Please enter both fields."],["దయచేసి మీ పాత్రను ఎంచుకోండి","Please select your role"],["జి.ఐ. పాఠశాల నిర్వహణ వేదిక","GI SCHOOL MANAGEMENT PLATFORM"],["స్వాగతం","Welcome"],["మీ పాత్రను ఎంచుకోండి","Please select your role"],["లాగిన్ గుర్తింపు సంఖ్య","Login ID"],["రహస్య సంఖ్య / పిన్","Password / PIN"],["4 అంకెల పిన్","4-digit PIN"],["లాగిన్ అవ్వండి","Sign in"],["నమస్కారం!","Welcome!"],["పాత్ర మార్చండి","Switch Role"],["నా తరగతులు","My Classes"],["కేటాయించిన తరగతులు","Assigned Classes"],["మీ విభాగాలు","My Sections"],["ఈరోజు ప్రత్యేకం","Today Special"],["వ్యక్తిగత వివరాలు","Personal Information"],["భాష","Language"],["రంగుల అమరిక","Theme"],["తెలుపు రంగు అమరిక","Light"],["ముదురు రంగు అమరిక","Dark"],["తల్లిదండ్రుల పిన్","Parent PIN"],["విద్యార్థి వివరాలు","Student Details"],["తరగతి /","Class /"],["పుట్టిన తేదీ","DOB"],["విద్యార్థి వివరాలు నిర్ధారించండి","Verify Student Details"],["నిర్ధారించి తల్లిదండ్రులను అనుసంధానించండి","Confirm & Link Parent"],["మీ డిజిటల్ అవసరాల కోసం","For Your Digital Needs"],["సంప్రదించండి","Contact"],["జి.ఐ. ప్రధాన నిర్వాహకులు","GI Super Admin"],["అధీకృత జి.ఐ. నిర్వాహకులకు మాత్రమే","Authorized GI Administrator Only"],["రహస్య సంకేతం","Secure Password"],["హాజరు నిర్వహణ","Attendance Management"],["ఉదయం / సాయంత్రం హాజరు","Morning / Evening Attendance"],["మార్పుల చరిత్ర","Audit History"],["నెలవారీ నివేదికలు","Monthly Reports"],["రోజువారీ నివేదికలు","Daily Reports"],["ఉపాధ్యాయుల సమర్పణ","Teacher Submission"],["ప్రధానోపాధ్యాయుల పరిశీలన","HM Review"],["తల్లిదండ్రుల వీక్షణ","Parent View"],["కార్యక్రమ తేదీ గుర్తింపు","Event Date Highlight"],["ఎంచుకున్న తేదీ","Selected Date"],["ముందుగా నిర్ణయించిన భోజనం","Planned Menu"],["వడ్డించిన భోజనం","Actually Served"],["పోస్టర్ నమూనాలు","Poster Templates"],["అక్షరాలు / రంగులు / అమరిక మార్చండి","Text / Color / Layout Edit"],["ముందస్తు నమూనా","Local Preview"],["పంచుకోండి","Share"],["విభాగం","Module"],["వివరాలు చూడటానికి విభాగాన్ని తెరవండి.","Open module to view details."],["అనుమతుల ప్రకారం అందుబాటులో ఉంటుంది.","Available according to permissions."],["ఈ తేదీకి కార్యక్రమాలు నమోదు కాలేదు.","No events are recorded for this date."],["ఈ తేదీకి సంబంధించిన అన్ని కార్యక్రమాలు కింద కనిపిస్తాయి.","All events for this date appear below."],["ఇది తెరపై కనిపించే నమూనా మాత్రమే.","This is a Frontend Preview."],["నిజమైన పాఠశాల సమాచారం, లాగిన్ ధృవీకరణ, ఆమోదాల నమోదు ఇంకా ఫైర్‌బేస్‌కు అనుసంధానం కాలేదు.","Real School Data, Authentication, Approval Writes are not yet connected to Firebase."],["అనుసంధానం చేసిన తర్వాత వివరాలు కనిపిస్తాయి.","Data will appear after connection."],["విద్యార్థుల జాబితా","Student List"],["ఉపాధ్యాయుల జాబితా","Teacher List"],["విద్యార్థిని చేర్చండి","Add a new student"],["కొత్త ఉపాధ్యాయుడిని చేర్చండి","Add a new teacher"],["పాఠశాల నోటీసు","School Notice"],["పాఠశాల కార్యక్రమాలు","School Events"],["పాఠశాల సెలవులు","School Holidays"],["పుట్టినరోజు","Birthday"],["ప్రత్యేక దినాలు","Special Days"],["గొప్ప వ్యక్తులు","Great People"],["మంచి మాటలు","Great Quotes"],["జి.ఐ. బ్లాగ్ లింక్","GI Blog Link"],["బ్లాగ్ లింక్","Blog Link"],["బ్లాగ్ తెరవండి","Open Blog"],["3వ తరగతి","Class 3"],["5వ తరగతి","Class 5"],["పెండింగ్‌లో ఉన్న ఆమోదాలు","Pending Approvals"],["ఈరోజు హాజరు","Today's Attendance"],["విద్యార్థులు","Students"],["ఉపాధ్యాయులు","Teachers"],["నా పిల్లల హాజరు","My Child's Attendance"],["అనుసంధానమైన విద్యార్థి","Linked Student"],["రోజువారీ డైరీ","Daily Diary"],["పాఠశాల వివరాలు","School Information"],["పాత్ర మరియు అనుమతులు","Role & Access"],["మన భవిష్యత్తు… మన గర్వం!","Our Future… Our Pride!"],["జి.ఐ. క్రియేటివ్ స్పేస్ రూపొందించినది","A GI Creative Space work"],["గోదావరి స్ఫూర్తితో.","Inspired by Godavari."],["ప్రధానోపాధ్యాయుల ప్రధాన పేజీ","Head Master Dashboard"],["పాఠశాల మొత్తం నిర్వహణ మరియు పర్యవేక్షణ","Complete school management and supervision"],["ఉపాధ్యాయుల ప్రధాన పేజీ","Teacher Dashboard"],["మీకు కేటాయించిన తరగతులు మరియు బోధనా పనులు","Your assigned classes and teaching tasks"],["తల్లిదండ్రుల ప్రధాన పేజీ","Parent Dashboard"],["మీ పిల్లల పాఠశాల సమాచారం","Your child's school information"],["స్వాగతం","Welcome"],["మీ పాత్రను ఎంచుకోండి","Choose your role"],["హెడ్మాస్టర్","Head Master"],["ఉపాధ్యాయుడు","Teacher"],["తల్లిదండ్రులు","Parent"],["ప్రవేశం","Login"],["మీ పాఠశాల ఖాతా వివరాలతో ప్రవేశించండి.","Sign in using your school account details."],["మీ Student ID మరియు Parent PINతో ప్రవేశించండి.","Sign in using your Student ID and Parent PIN."],["మొదటిసారి? పిల్లలను లింక్ చేయండి","First time? Link your child"],["ముందుగా మీ పిల్లలను లింక్ చేయండి.","Please link your child first."],["Student ID లేదా PIN సరిపోలలేదు.","Student ID or PIN does not match."],["పిల్లలను లింక్ చేయండి","Link your child"],["విద్యార్థి వివరాలను నిర్ధారించి మీ Parent PIN సెట్ చేసుకోండి.","Confirm the student details and set your Parent PIN."],["తరగతి ఎంచుకోండి","Choose a class"],["డెమో విద్యార్థి","Demo Student"],["విద్యార్థి వివరాలు నిర్ధారించు","Verify student details"],["DOB నమోదు చేసి ఒకే 4-digit PIN రెండుసార్లు నమోదు చేయండి.","Enter date of birth and the same 4-digit PIN twice."],["Parent Linking పూర్తయింది.","Parent linking completed."],["నమస్కారం!","Hello!"],["నా తరగతులు","My Classes"],["మీకు కేటాయించిన తరగతులు మాత్రమే కనిపిస్తాయి.","Only your assigned classes are shown."],["లింక్ చేసిన విద్యార్థి","Linked Student"],["విద్యార్థి వివరాలు","Student Details"],["మీ విభాగాలు","Your Sections"],["మీ Roleకు అనుమతించిన సేవలు","Services available for your role"],["పుట్టినరోజులు మరియు క్యాలెండర్ ప్రత్యేక దినాలు.","Birthdays and special calendar days."],["GI నిర్వహించే ఒకే Blog Link.","One centrally managed GI blog link."],["బ్లాగ్ తెరవండి","Open Blog"],["హాజరు నిర్వహణ","Attendance Management"],["ఉదయం / సాయంత్రం Attendance","Morning / Evening Attendance"],["HM సవరణల ఆమోదం మరియు Audit History","Head Master approvals and change history"],["తరగతి వారీగా హాజరు నివేదికలు","Class-wise attendance reports"],["ఉపాధ్యాయుల జాబితా","Teacher List"],["కొత్త ఉపాధ్యాయుడిని చేర్చండి","Add a new teacher"],["ప్రొఫైల్ మరియు కేటాయించిన తరగతులు","Profile and assigned classes"],["విద్యార్థుల జాబితా","Student List"],["విద్యార్థిని చేర్చండి","Add a student"],["Class / Roll Number నిర్వహణ","Class / Roll Number management"],["విషయాల వారీగా డైరీ","Subject-wise diary"],["HM Review → Approve / Reject","Head Master Review → Approve / Reject"],["Parentకు Approved Diary మాత్రమే","Only approved diary is visible to parents"],["హోంవర్క్ జాబితా","Homework List"],["విషయం, తరగతి, Due Date","Subject, Class, Due Date"],["నోటీసుల జాబితా","Notice List"],["నెలవారీ క్యాలెండర్","Monthly Calendar"],["ఎంచుకున్న తేదీకి అన్ని ఈవెంట్లు","All events on the selected date"],["ప్రణాళిక మరియు వడ్డించిన భోజనం","Planned and served meals"],["పాఠశాల పోస్టర్ల రూపకల్పన","School poster design"],["పాఠశాల ప్రాథమిక సెట్టింగ్స్","Basic school settings"],["పేరు మరియు ప్రాథమిక వివరాలు","Name and basic details"],["మీకు అనుమతించిన విభాగాలు","Sections available to you"],["పాఠశాల వివరాలు","School details"],["ప్రస్తుత Session ముగించండి","End the current session"],["పాఠశాల కార్యక్రమాలు, సెలవులు","School events and holidays"],["వాస్తవంగా వడ్డించిన భోజన వివరాలు","Details of meals actually served"],["పుట్టినరోజులు, ప్రత్యేక దినాలు","Birthdays and special days"],["విద్యార్థులకు ఉపయోగకరమైన జీవిత విశేషాలు","Useful life stories for students"],["ప్రేరణాత్మక సూక్తులు","Inspirational quotes"],["పోస్టర్ తయారీ","Create a poster"],["పాఠశాల నివేదికలు","School reports"],["పాఠశాల ప్రాథమిక వివరాలు","Basic school details"],["ప్రణాళిక చేసిన మెనూ","Planned menu"],["వాస్తవంగా వడ్డించినది","Actually served"],["ఎంచుకున్న తేదీ","Selected date"],["ఈ తేదీకి సంబంధించిన అన్ని ఈవెంట్లు క్రింద కనిపిస్తాయి.","All events for this date appear below."],["ఈ తేదీకి ఈవెంట్లు నమోదు కాలేదు.","No events are recorded for this date."],["మీ డిజిటల్ అవసరాల కోసం","For Your Digital Needs"],["సంప్రదించండి","Contact"],["జి.ఐ. ప్రధాన నిర్వాహకులు","GI Super Admin"],["అధీకృత జి.ఐ. నిర్వాహకులకు మాత్రమే","Authorized GI Administrators Only"],["సురక్షిత ప్రవేశం","Secure Login"],["ముందస్తు వీక్షణ — ఫైర్‌బేస్ లాగిన్ ఇంకా అనుసంధానం కాలేదు.","Preview Mode — Firebase login is not connected yet."],["లాగిన్ గుర్తింపు సంఖ్య","Login ID"],["రహస్య సంఖ్య / పిన్","Password / PIN"],["పాత్ర మార్చండి","Switch Role"],["వెనక్కి","Back"],["హోమ్","Home"],["ప్రధాన పేజీ","Dashboard"],["భాష","Language"],["సెట్టింగులు","Settings"],["కార్యక్రమాలు మరియు క్యాలెండర్","Events & Calendar"],["నోటీసు బోర్డు","Notice Board"],["రోజువారీ డైరీ","Daily Diary"],["ఇంటి పని","Homework"],["హాజరు","Attendance"],["మధ్యాహ్న భోజనం","Mid-Day Meal"],["ఈరోజు ప్రత్యేకం","Today Special"],["గొప్ప వ్యక్తులు","Great People"],["మంచి మాటలు","Great Quotes"],["నివేదికలు","Reports"],["విద్యార్థుల జాబితా","Student List"],["ఉపాధ్యాయుల జాబితా","Teacher List"],["పాఠశాల వివరాలు","School Settings"],["కార్యక్రమాలు","Events"],["వడ్డించిన భోజనం","Served Meal"],["ముందుగా నిర్ణయించిన భోజనం","Planned Menu"],["విద్యార్థి గుర్తింపు సంఖ్య","Student ID"],["తల్లిదండ్రుల పిన్","Parent PIN"],["పుట్టిన తేదీ","Date of Birth"],["క్రమ సంఖ్య","Roll Number"],["నిర్ధారించు","Confirm"],["చూడటానికి మాత్రమే","View Only"],["పోస్టర్ నమూనా","Poster Preview"],["రూపకల్పన మార్చండి","Edit Design"],["నిష్క్రమణ","Logout"],["ఆమోదించండి","Approve"],["తిరస్కరించండి","Reject"],["గొప్ప మాటలు","Great Quotes"],["పాత్ర","Role"],["వ్యక్తిగత వివరాలు","Profile"],["అనుమతులు","Permissions"],["క్యాలెండర్","Calendar"],["సురక్షిత లాగిన్","Secure Login"],["స్వాగతం!","Welcome!"],["మీ పిల్లల హాజరు","My Child's Attendance"],["లాగిన్","Login"],["ఈరోజు హాజరు","Today's Attendance"],["పెండింగ్ ఆమోదాలు","Pending Approvals"],["ప్రధానోపాధ్యాయుల పరిశీలన","Head Master Review"],["నెలవారీ నివేదికలు","Monthly Reports"],["రోజువారీ నివేదికలు","Daily Reports"],["పాఠశాల కార్యక్రమాలు","School Events"],["పాఠశాల సెలవులు","School Holidays"],["పిల్లలను అనుసంధానించండి","Link your child"],["థీమ్","Theme"],["ఫైర్‌బేస్","Firebase"],["లాగిన్ ధృవీకరణ","Authentication"],["నిర్వహణ","Management"],["నమోదు","Record"],["సమర్పణ","Submission"],["ప్రచురించండి","Publish"],["తేదీ","Date"],["తరగతులు","Classes"],["విషయం","Subject"],["పేరు","Name"],["సేవలు","Services"],["నమోదు చేయండి","Enter"],["డేటా అనుసంధానం తర్వాత నిజమైన వివరాలు కనిపిస్తాయి.","Real details will appear after data connection."],["ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.","Details and actions for this section."],["పాఠశాల మొత్తం నిర్వహణ మరియు పర్యవేక్షణ","Complete school administration and monitoring"],["తరగతుల కేటాయింపు","Class assignments"],["ఉదయం / సాయంత్రం హాజరు","Morning / evening attendance"],["విషయాల వారీగా సమర్పణలు, ఆమోదాలు","Subject-wise submissions and approvals"],["విద్యార్థుల వివరాలు, తరగతి / రోల్ నిర్వహణ","Student details and class / roll management"],["నోటీసుల పరిశీలన, ఆమోదం, ప్రచురణ","Review, approve and publish notices"],["ప్రణాళిక మరియు వడ్డించిన భోజనం","Planned and served meals"],["పాఠశాల కార్యక్రమాలు, సెలవులు","School events and holidays"],["పుట్టినరోజులు, ప్రత్యేక దినాలు","Birthdays and special days"],["GI నిర్వహించే Blog Link","GI-managed blog link"],["పాఠశాల పోస్టర్ల రూపకల్పన","School poster design"],["పాఠశాల ప్రాథమిక సెట్టింగ్స్","Basic school settings"],["పిల్లల వివరాలు","Child details"],["మీ పిల్లల వివరాలు","Your child's details"],["తరగతి / రోల్ నిర్వహణ","Class / roll management"],["ముందుగా నిర్ణయించిన భోజనం","Planned meal"],["వడ్డించిన భోజనం","Served meal"],["విద్యార్థి వివరాలు","Student details"],["తల్లిదండ్రుల వివరాలు","Parent details"],["అన్ని విభాగాలు","All sections"],["సురక్షిత ప్రవేశం","Secure access"],["మీ ఖాతా వివరాలు","Your account details"],["ప్రస్తుత సెషన్","Current session"],["అందుబాటులో ఉంటుంది","Available"],["పరిశీలన","Review"],["ఆమోదం","Approval"],["పాఠశాల సమాచారం","School information"],["పాఠశాల నిర్వహణ","School management"],["క్యాలెండర్ ప్రత్యేక దినాలు","Calendar special days"],["కార్యక్రమ తేదీలు ప్రత్యేకంగా గుర్తించబడతాయి","Event dates are highlighted"],["ఎంచుకున్న తేదీకి అన్ని కార్యక్రమాలు","All events for the selected date"],["పిల్లల హాజరు","Child attendance"],["పాఠశాల నోటీసులు","School notices"],["మీ పాఠశాల ఖాతా వివరాలతో ప్రవేశించండి.","Sign in with your school account details."],["ముందస్తు వీక్షణ — ఫైర్‌బేస్ లాగిన్ ఇంకా అనుసంధానం కాలేదు.","Preview mode — Firebase login is not connected yet."]];
translationPairs.push(...[["ప్రొఫైల్","Profile"],["వ్యక్తిగత సమాచారం","Personal Information"],["పేరు మరియు ప్రాథమిక వివరాలు","Name and basic details"],["పాత్ర మరియు ప్రవేశ అనుమతులు","Role & Access"],["పాఠశాల సమాచారం","School Information"],["సెట్టింగులు","Settings"],["భాష","Language"],["తెలుగు / English","Telugu / English"],["థీమ్","Theme"],["లైట్ / డార్క్","Light / Dark"],["పాత్ర మార్చండి","Switch Role"],["స్వాగతం పేజీకి తిరిగి వెళ్లండి","Return to Welcome Screen"],["లాగ్ అవుట్","Logout"],["ప్రస్తుత సెషన్ ముగించండి","End the current session"],["విద్యార్థి వివరాలను నిర్ధారించండి","Verify student details"],["తరగతి ఎంచుకోండి","Choose a class"],["వెనక్కి","Back"],["డాష్‌బోర్డ్","Dashboard"],["హోమ్","Home"],["క్యాలెండర్","Calendar"],["వ్యక్తిగత వివరాలు","Personal Details"],["సురక్షిత లాగిన్","Secure Login"],["అధీకృత జి.ఐ. నిర్వాహకులకు మాత్రమే","Authorized GI Administrators Only"],["ప్రామాణీకరణ ఇంకా సిద్ధం కాలేదు.","Authentication is not ready yet."],["పిల్లలను లింక్ చేయండి","Link your child"],["విద్యార్థి గుర్తింపు సంఖ్య","Student ID"],["క్రమ సంఖ్య","Roll Number"],["తేదీ ఎంచుకోండి","Select date"],["పోస్టర్ నమూనా","Poster template"],["పాఠశాల పేరు","School name"],["ముందస్తు వీక్షణ","Preview Mode"],["విద్యార్థుల సంఖ్య","Students"],["ఉపాధ్యాయుల సంఖ్య","Teachers"],["ఈరోజు హాజరు","Today's Attendance"],["పెండింగ్ ఆమోదాలు","Pending Approvals"],["నా తరగతులు","My Classes"],["మీకు కేటాయించిన తరగతులు మాత్రమే కనిపిస్తాయి.","Only your assigned classes are shown."],["లింక్ చేసిన విద్యార్థి","Linked Student"],["మీ విభాగాలు","Your Modules"],["మీ పాత్రకు అనుమతించిన సేవలు","Services available for your role"],["సృష్టించండి","Create"],["సవరించండి","Edit"],["తొలగించండి","Delete"],["చూడండి","View"],["ముందు నెల","Previous month"],["తదుపరి నెల","Next month"],["ఎంచుకున్న తేదీ","Selected date"]]);
translationPairs.push(...[["ప్రొఫైల్","Profile"],["వ్యక్తిగత సమాచారం","Personal Information"],["పేరు మరియు ప్రాథమిక వివరాలు","Name and basic details"],["పాత్ర మరియు అనుమతులు","Role & Access"],["మీకు అనుమతించిన విభాగాలు","Sections available to you"],["పాఠశాల సమాచారం","School Information"],["సెట్టింగులు","Settings"],["భాష","Language"],["తెలుగు / English","Telugu / English"],["థీమ్","Theme"],["లైట్ / డార్క్","Light / Dark"],["స్వాగతం పేజీకి తిరిగి వెళ్లండి","Return to Welcome Screen"],["ప్రస్తుత సెషన్ ముగించండి","End the current session"],["విద్యార్థి వివరాలను నిర్ధారించండి","Verify student details"],["తరగతి ఎంచుకోండి","Choose a class"],["డాష్‌బోర్డ్","Dashboard"],["వ్యక్తిగత వివరాలు","Personal Details"],["సురక్షిత లాగిన్","Secure Login"],["అధీకృత జి.ఐ. నిర్వాహకులకు మాత్రమే","Authorized GI Administrators Only"],["ప్రామాణీకరణ ఇంకా సిద్ధం కాలేదు.","Authentication is not ready yet."],["విద్యార్థి గుర్తింపు సంఖ్య","Student ID"],["క్రమ సంఖ్య","Roll Number"],["తేదీ ఎంచుకోండి","Select date"],["పోస్టర్ నమూనా","Poster template"],["పాఠశాల పేరు","School name"],["విద్యార్థుల సంఖ్య","Students"],["ఉపాధ్యాయుల సంఖ్య","Teachers"],["పెండింగ్ ఆమోదాలు","Pending Approvals"],["నా తరగతులు","My Classes"],["మీకు కేటాయించిన తరగతులు మాత్రమే కనిపిస్తాయి.","Only your assigned classes are shown."],["లింక్ చేసిన విద్యార్థి","Linked Student"],["మీ విభాగాలు","Your Modules"],["మీ పాత్రకు అనుమతించిన సేవలు","Services available for your role"],["విభాగాన్ని తెరిచి వివరాలు చూడండి.","Open the section to view details."],["అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది.","Available according to permissions."],["ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.","Details and actions for this section."],["ఈ విభాగానికి సంబంధించిన వివరాలు","Details for this section"],["విభాగ వివరాలు","Module details"],["డెమో సమాచారం","Demo information"],["ఈ స్క్రీన్ UI Preview దశలో ఉంది","This screen is in UI preview"],["ఇది Frontend Preview.","This is a Frontend Preview."],["నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.","Real School Data, Authentication and approval writes are not yet connected to Firebase."],["ముందుగా మీ పిల్లలను లింక్ చేయండి.","Please link your child first."],["Student ID లేదా PIN సరిపోలలేదు.","Student ID or PIN does not match."],["Parent Linking పూర్తయింది.","Parent linking completed."],["విద్యార్థి వివరాలు నిర్ధారించు","Verify student details"],["DOB నమోదు చేసి ఒకే 4-digit PIN రెండుసార్లు నమోదు చేయండి.","Enter date of birth and the same 4-digit PIN twice."],["మళ్లీ PIN నమోదు చేయండి","Enter PIN again"],["Class, Student ID, Roll Number నమోదు చేయండి.","Enter Class, Student ID and Roll Number."],["డెమో విద్యార్థి","Demo Student"],["విద్యార్థి వివరాలు","Student Details"],["పాఠశాల మొత్తం నిర్వహణ మరియు పర్యవేక్షణ","Complete school management and supervision"],["ఉదయం / సాయంత్రం హాజరు","Morning / Evening Attendance"],["HM సవరణల ఆమోదం మరియు Audit History","Head Master approvals and audit history"],["తరగతి వారీగా హాజరు నివేదికలు","Class-wise attendance reports"],["కొత్త ఉపాధ్యాయుడిని చేర్చండి","Add a new teacher"],["విద్యార్థిని చేర్చండి","Add a student"],["Class / Roll Number నిర్వహణ","Class / Roll Number management"],["విషయాల వారీగా డైరీ","Subject-wise diary"],["HM Review → Approve / Reject","Head Master Review → Approve / Reject"],["Parentకు Approved Diary మాత్రమే","Only approved diary is visible to parents"],["విషయం, తరగతి, Due Date","Subject, Class, Due Date"],["నోటీసుల జాబితా","Notice List"],["ఎంచుకున్న తేదీకి అన్ని ఈవెంట్లు","All events on the selected date"],["ఎంచుకున్న తేదీకి భోజన వివరాలు","Meal details for the selected date"],["అదనపు ఆహారం / Sponsor వివరాలు","Additional food / Sponsor details"],["రోజువారీ రికార్డ్","Daily record"],["పుట్టినరోజులు","Birthdays"],["జాతీయ / అంతర్జాతీయ ప్రత్యేక దినాలు","National / International special days"],["పాఠశాల ప్రత్యేకతలు","School highlights"],["గొప్ప వ్యక్తుల జాబితా","Great People List"],["HM నిర్వహణ","Managed by Head Master"],["Teacher / Parent View Only","Teacher / Parent View Only"],["ఒకే GI Blog Link","One GI Blog Link"],["వ్యాసాలు యాప్‌లో నిల్వ చేయబడవు","Articles are not stored in the app"],["రోజువారీ నివేదికలు","Daily Reports"],["నెలవారీ నివేదికలు","Monthly Reports"],["అనుమతులు మరియు సెట్టింగ్స్","Permissions and Settings"],["వెనక్కి","Back"],["ముందు నెల","Previous month"],["తదుపరి నెల","Next month"],["ఎంచుకున్న తేదీ","Selected date"],["కార్యక్రమ తేదీలు ప్రత్యేకంగా గుర్తించబడతాయి","Event dates are highlighted"],["ఈ తేదీకి కార్యక్రమాలు నమోదు కాలేదు.","No events are recorded for this date."],["ఈ తేదీకి సంబంధించిన అన్ని కార్యక్రమాలు క్రింద కనిపిస్తాయి.","All events for this date appear below."],["పిల్లలను లింక్ చేయండి","Link your child"],["విద్యార్థి వివరాలు నిర్ధారించు","Verify Student Details"],["ప్రవేశించండి","Sign in"],["లాగిన్","Login"],["లాగ్ అవుట్","Logout"],["నోటీసు సృష్టించండి","Create Notice"],["ఆమోదించండి","Approve"],["తిరస్కరించండి","Reject"],["చూడటానికి మాత్రమే","View Only"],["పోస్టర్ నమూనాలు","Poster Templates"],["అక్షరాలు / రంగులు / అమరిక మార్చండి","Text / Color / Layout Edit"],["స్థానిక నమూనా → పంచుకోండి","Local Preview → Share"],["హాజరు సారాంశం","Attendance Summary"]]);
translationPairs.push(...[["ఉదయం / సాయంత్రం హాజరు, సవరణల ఆమోదం","Morning / evening attendance and edit approvals"],["ఉపాధ్యాయుల వివరాలు, తరగతుల కేటాయింపు","Teacher details and class assignments"],["ఈవెంట్స్ & క్యాలెండర్","Events & Calendar"],["తేదీ వారీగా భోజన వివరాలు","Date-wise meal details"],["రిపోర్ట్స్","Reports"],["పాఠశాల సెట్టింగ్స్","School Settings"],["కేటాయించిన తరగతులకు ఉదయం / సాయంత్రం హాజరు","Morning / evening attendance for assigned classes"],["పాఠశాల నోటీసులు చూడటం","View school notices"],["పాఠశాల కార్యక్రమాలు చూడటం","View school events"],["కేటాయించిన నమోదు / పరిశీలన","Assigned records / review"],["రోజువారీ మరియు నెలవారీ హాజరు","Daily and monthly attendance"],["పోస్టర్ తయారు చేసి డౌన్‌లోడ్ చేయండి","Create and download posters"],["హెడ్ మాస్టర్","Head Master"],["మొదటిసారి? పిల్లలను లింక్ చేయండి","First time? Link your child"],["Preview Mode — Firebase Authentication ఇంకా అనుసంధానం కాలేదు.","Preview Mode — Firebase Authentication is not connected yet."],["వెనక్కి","Back"],["Parent–Student Linking","తల్లిదండ్రులు – విద్యార్థి అనుసంధానం"],["విద్యార్థి వివరాలను నిర్ధారించి మీ Parent PIN సెట్ చేసుకోండి.","Verify student details and set your Parent PIN."],["1. వివరాలు","1. Details"],["2. DOB","2. Date of Birth"],["3. PIN","3. PIN"],["Class / తరగతి","Class"],["తరగతి ఎంచుకోండి","Choose a class"],["మీ 4-digit Parent PIN సెట్ చేయండి","Set your 4-digit Parent PIN"],["డెమో విద్యార్థి","Demo Student"],["మీ Roleకు అనుమతించిన సేవలు","Services available for your role"],["ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.","Details and actions for this module."],["విభాగాన్ని తెరిచి వివరాలు చూడండి.","Open the module to view details."],["అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది.","Available according to permissions."],["ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.","This is a frontend preview. Real school data, authentication and approval writes are not yet connected to Firebase."],["పేరు మరియు ప్రాథమిక వివరాలు","Name and basic details"],["పాఠశాల వివరాలు","School details"],["Welcome Screen‌కు తిరిగి వెళ్లండి","Return to the Welcome Screen"],["Authentication placeholder — secure backend ఇంకా అనుసంధానం కాలేదు.","Authentication placeholder — secure backend is not connected yet."],["GI Super Admin Authentication ఇంకా సిద్ధం కాలేదు.","GI Super Admin authentication is not ready yet."],["నమస్కారం!","Hello!"],["ప్రొఫైల్","Profile"],["మీ విభాగాలు","Your modules"],["మధ్యాహ్న భోజనం","Mid-Day Meal"],["పాఠశాల పోస్టర్ల రూపకల్పన","School poster design"],["పిల్లల వివరాలు","Child details"]]);
function translateValue(value){
 const direction=state.lang==="te"?0:1;
 const sorted=[...translationPairs].sort((a,b)=>b[1-direction].length-a[1-direction].length);
 let out=String(value??"");
 for(const pair of sorted){const from=pair[1-direction],to=pair[direction];if(from)out=out.split(from).join(to)}
 return out;
}
function applyTranslations(){
 const walk=node=>{for(const child of [...node.childNodes]){if(child.nodeType===3)child.nodeValue=translateValue(child.nodeValue);else if(child.nodeType===1){for(const attr of ["placeholder","title","aria-label"])if(child.hasAttribute(attr))child.setAttribute(attr,translateValue(child.getAttribute(attr)));walk(child)}}};
 const appRoot=document.querySelector("#app");
 const footer=appRoot?.querySelector("#appFooter");
 if(footer) footer.querySelectorAll(".footer-link").forEach(el=>{el.dataset.keepEnglish=el.textContent});
 walk(appRoot);
 if(footer) footer.querySelectorAll(".footer-link").forEach(el=>{if(el.dataset.keepEnglish)el.textContent=el.dataset.keepEnglish});
 document.documentElement.lang=state.lang;
}

const roleNames={hm:["ప్రధానోపాధ్యాయులు","Head Master"],teacher:["ఉపాధ్యాయుడు","Teacher"],parent:["తల్లిదండ్రులు","Parent"]};
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
  ["utensils","మధ్యాహ్న భోజనం","Mid-Day Meal","తేదీ వారీగా భోజన వివరాలు"],
  ["sun","Today Special","Today Special","పుట్టినరోజులు, ప్రత్యేక దినాలు"],
  ["book-heart","గొప్ప వ్యక్తులు","Great People","విద్యార్థులకు ఉపయోగకరమైన జీవిత విశేషాలు"],
  ["quote","గొప్ప సూక్తులు","Great Quotes","ప్రేరణాత్మక సూక్తులు"],
  ["palette","Poster Studio","Poster Studio","పాఠశాల పోస్టర్ల రూపకల్పన"],
  ["chart-no-axes-column","రిపోర్ట్స్","Reports","పాఠశాల నివేదికలు"],
  ["settings","పాఠశాల సెట్టింగ్స్","School Settings","పాఠశాల ప్రాథమిక సెట్టింగ్స్"]
 ],
 teacher:[
  ["calendar-check","హాజరు","Attendance","కేటాయించిన తరగతులకు ఉదయం / సాయంత్రం హాజరు"],
  ["notebook-pen","డైలీ డైరీ","Daily Diary","విషయాల వారీగా డైరీ నమోదు, సమర్పణ"],
  ["book-open","హోంవర్క్","Homework","విద్యార్థులకు హోంవర్క్ ఇవ్వడం"],
  ["megaphone","నోటీసు బోర్డు","Notice Board","పాఠశాల నోటీసులు చూడటం"],
  ["calendar-days","ఈవెంట్స్ & క్యాలెండర్","Events & Calendar","పాఠశాల కార్యక్రమాలు చూడటం"],
  ["utensils","మధ్యాహ్న భోజనం","Mid-Day Meal","కేటాయించిన నమోదు / పరిశీలన"],
  ["sun","Today Special","Today Special","పుట్టినరోజులు, ప్రత్యేక దినాలు"],
  ["book-heart","గొప్ప వ్యక్తులు","Great People","View Only"],
  ["quote","గొప్ప సూక్తులు","Great Quotes","View Only"],
  ["palette","Poster Studio","Poster Studio","పోస్టర్ తయారీ"]
 ],
 parent:[
  ["calendar-check","నా పిల్లల హాజరు","Attendance","రోజువారీ మరియు నెలవారీ హాజరు"],
  ["notebook-pen","డైలీ డైరీ","Daily Diary","HM ఆమోదించిన డైరీ మాత్రమే"],
  ["book-open","హోంవర్క్","Homework","ఇచ్చిన హోంవర్క్ వివరాలు"],
  ["megaphone","నోటీసు బోర్డు","Notice Board","పాఠశాల ఆమోదించిన నోటీసులు"],
  ["calendar-days","ఈవెంట్స్ & క్యాలెండర్","Events & Calendar","పాఠశాల కార్యక్రమాలు, సెలవులు"],
  ["utensils","మధ్యాహ్న భోజనం","Mid-Day Meal","వాస్తవంగా వడ్డించిన భోజన వివరాలు"],
  ["sun","Today Special","Today Special","పుట్టినరోజులు, ప్రత్యేక దినాలు"],
  ["book-heart","గొప్ప వ్యక్తులు","Great People","చూడటానికి మాత్రమే"],
  ["quote","గొప్ప సూక్తులు","Great Quotes","చూడటానికి మాత్రమే"],
  ["palette","Poster Studio","Poster Studio","పోస్టర్ తయారు చేసి డౌన్‌లోడ్ చేయండి"]
 ]
};
const main=document.querySelector("#mainView");
document.documentElement.dataset.theme=state.theme;
const iconSvg=(name)=>({school:"▦",presentation:"▤",users:"♧", "calendar-check":"▣","notebook-pen":"✎","book-open":"▤",megaphone:"◖", "calendar-days":"▦",utensils:"♨",sun:"☼","book-heart":"♡",quote:"❝",globe:"◎",palette:"▧","chart-no-axes-column":"▥",settings:"⚙","graduation-cap":"⌂",bell:"♢",user:"○",shield:"⬡"}[name]||"•");
function toggleLanguage(){
 state.lang=state.lang==="te"?"en":"te";
 localStorage.setItem("gim_lang",state.lang);
 render();
 const popup=document.querySelector("#gcsWelcomePopup");if(popup)renderCreativeWelcome(popup);
}
function toggleTheme(){
 state.theme=state.theme==="light"?"dark":"light";
 localStorage.setItem("gim_theme",state.theme);
 document.documentElement.dataset.theme=state.theme;
 render();
}
document.querySelector("#languageToggle").onclick=toggleLanguage;
document.querySelector("#themeToggle").onclick=toggleTheme;
document.querySelector("#brandHome").onclick=()=>{state.view=state.authenticated?"dashboard":state.role?"login":"welcome";render()};
function welcome(){
 main.innerHTML=`<section class="welcome-panel">
  <div class="welcome-kicker">${T("విద్యాభివృద్ధికి అంకితం","A TRIBUTE TO EDUCATION")}</div>
  <h2 class="welcome-intro">${T("స్వాగతం","Welcome to")}</h2>
  <div class="welcome-honourees" aria-label="BVR, CVPMR and DNR">
   <h2>${T("బి.వి. రాజు","B. V. Raju")}</h2>
   <h2>${T("సి.వి.పి. మూర్తి రాజు","C. V. P. Murthy Raju")}</h2>
   <h2>${T("దంతులూరి నారాయణ రాజు","Dantuluri Narayana Raju")}</h2>
  </div>
  <div class="welcome-divider" aria-hidden="true"></div>
  <h1>${T("డిజిటల్ మన బడి","Digital Mana Badi")}</h1>
  <div class="welcome-platform">SCHOOL MANAGEMENT PLATFORM</div>
  <p class="welcome-tagline">${T("మన భవిష్యత్తు… మన గర్వం!","Our Future… Our Pride!")}</p>
  <p class="welcome-description">${T("ఆలోచనలు, సృజనాత్మకత, సాంకేతికత కలసి మార్పును తీసుకువస్తాయి.","Ideas, creativity and technology coming together to make a difference.")}</p>
  <p class="role-prompt">${T("మీ పాత్రను ఎంచుకోండి","SELECT YOUR ROLE")}</p>
 </section>
 <section class="role-stack" aria-label="Select your role">
  ${roleCard("school","హెడ్ మాస్టర్","Head Master","hm","green")}
  ${roleCard("presentation","ఉపాధ్యాయుడు","Teacher","teacher","gold")}
  ${roleCard("users","తల్లిదండ్రులు","Parent","parent","blue")}
 </section>`;
 main.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{state.role=b.dataset.role;state.authenticated=false;localStorage.setItem("gim_role",state.role);localStorage.removeItem("gim_authenticated");state.view="login";render()});
}
function roleCard(ic,te,en,role,tone){
 const quote={hm:"A great school begins with great leadership.",teacher:"A teacher inspires a thousand possibilities.",parent:"Every child’s journey begins with family support."}[role];
 return `<button type="button" class="role-card role-${tone}" data-role="${role}"><span class="role-icon">${iconSvg(ic)}</span><span class="role-copy"><strong>${T(te,en)}</strong><small>${quote}</small></span><span class="role-arrow" aria-hidden="true">›</span></button>`;
}

function login(){
 const role=roleNames[state.role], parent=state.role==="parent";
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="backWelcome">← ${T("వెనక్కి","Back")}</button><span class="pill">${T(role[0],role[1])}</span></div>
 <section class="form-card"><div class="login-symbol">${iconSvg(roleMeta[state.role].icon)}</div><h2>${T(role[0]+" లాగిన్",role[1]+" Login")}</h2><p>${parent?T("మీ Student ID మరియు Parent PINతో ప్రవేశించండి.","Sign in with your Student ID and Parent PIN."):T("మీ పాఠశాల ఖాతా వివరాలతో ప్రవేశించండి.","Sign in with your school account credentials.")}</p>
 ${parent?'<div class="field"><label>Student ID</label><input id="loginId" placeholder="Student ID"></div><div class="field"><label>Parent PIN</label><input id="loginPin" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit PIN"></div><button class="btn full" id="loginGo">Login</button><div class="link-row"><button class="text-link" id="startLink">మొదటిసారి? పిల్లలను లింక్ చేయండి</button></div>':
 '<div class="field"><label>'+T("Login ID","Login ID")+'</label><input id="loginId" placeholder="'+T("మీ Login ID","Enter your Login ID")+'"></div><div class="field"><label>'+T("Password / PIN","Password / PIN")+'</label><input id="loginPin" type="password" placeholder="••••••••"></div><button class="btn full" id="loginGo">'+T("Login","Login")+'</button><div class="demo-note">Preview Mode — Firebase Authentication ఇంకా అనుసంధానం కాలేదు.</div>'}
 </section>`;
 document.querySelector("#backWelcome").onclick=()=>{state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 if(parent)document.querySelector("#startLink").onclick=()=>{state.view="link";render()};
 document.querySelector("#loginGo").onclick=()=>{
  const id=document.querySelector("#loginId").value.trim(),pin=document.querySelector("#loginPin").value.trim();
  if(APP_CONFIG.demoMode && !id && !pin){state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();return}
  if(!id||!pin){toast(T("రెండు వివరాలు నమోదు చేయండి.","Please enter both fields."));return}
  if(parent&&!state.parentLinked){toast("ముందుగా మీ పిల్లలను లింక్ చేయండి.");return}
  if(parent&&(id!==state.linkedStudent?.id||pin!==state.linkedStudent?.pin)){toast("Student ID లేదా PIN సరిపోలలేదు.");return}
  state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();
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
 ${commonHighlights()}`;
 main.querySelectorAll("[data-module]").forEach(b=>b.onclick=()=>{state.module=b.dataset.module;state.view="module";render()});
 document.querySelector("#switchRoleHome").onclick=()=>{state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 document.querySelector("#profileBtn").onclick=()=>{state.view="profile";render()};
}
function commonHighlights(){return `<section class="knowledge-card"><div class="knowledge-icon">◎</div><div><h2>${T("మన విజ్ఞాన ప్రపంచం","GI Knowledge World")}</h2><p>${T("జి.ఐ. నిర్వహించే ఒకే విజ్ఞాన బ్లాగ్ లింక్.","One centrally managed GI blog link.")}</p></div><a href="${APP_CONFIG.knowledgeBlogUrl}" target="_blank" rel="noopener">${T("బ్లాగ్ తెరవండి","Open Blog")} ↗</a></section>`}
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
 "School Settings":["పాఠశాల ప్రాథమిక వివరాలు","అనుమతులు మరియు సెట్టింగ్స్"]
 }[title]||["విభాగ వివరాలు","డెమో సమాచారం","ఈ స్క్రీన్ UI Preview దశలో ఉంది"];
 const calendar=title==="Events & Calendar";
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail"><h2>${escapeHtml(title)}</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>
 ${calendar?calendarMarkup():""}
 <div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>
 ${title==="Mid-Day Meal"?mealMarkup():""}
 ${title==="Poster Studio"?posterMarkup():""}
 <div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div></section>`;
 document.querySelector("#moduleBack").onclick=()=>{state.view="dashboard";render()};
 main.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDate=Number(b.dataset.day);render()});
  const prev=main.querySelector("#calendarPrev"),next=main.querySelector("#calendarNext");
  if(prev)prev.onclick=()=>{state.selectedMonth--;if(state.selectedMonth<0){state.selectedMonth=11;state.selectedYear--}state.selectedDate=1;render()};
  if(next)next.onclick=()=>{state.selectedMonth++;if(state.selectedMonth>11){state.selectedMonth=0;state.selectedYear++}state.selectedDate=1;render()};
  const prev=main.querySelector("#calendarPrev"),next=main.querySelector("#calendarNext");
  if(prev)prev.onclick=()=>{state.selectedMonth--;if(state.selectedMonth<0){state.selectedMonth=11;state.selectedYear--}state.selectedDate=1;render()};
  if(next)next.onclick=()=>{state.selectedMonth++;if(state.selectedMonth>11){state.selectedMonth=0;state.selectedYear++}state.selectedDate=1;render()};
 setupPosterEditor();
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
function profilePage(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="profileBack">← Dashboard</button></div><section class="form-card"><div class="login-symbol">◉</div><h2>Profile</h2><p>${roleNames[state.role][0]} • ${APP_CONFIG.schoolName}</p><div class="detail-list"><div class="detail-row"><div><strong>Personal Information</strong><small>పేరు మరియు ప్రాథమిక వివరాలు</small></div>›</div><div class="detail-row"><div><strong>Role & Access</strong><small>మీకు అనుమతించిన విభాగాలు</small></div>›</div><div class="detail-row"><div><strong>School Information</strong><small>పాఠశాల వివరాలు</small></div>›</div></div></section>`;
 document.querySelector("#profileBack").onclick=()=>{state.view="dashboard";render()};
}
function settingsPage(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="settingsBack">← Dashboard</button></div><section class="card module-detail"><h2>Settings</h2><div class="detail-list"><div class="detail-row"><div><strong>Language</strong><small>తెలుగు / English</small></div><button class="btn secondary" id="settingsLang">Change</button></div><div class="detail-row"><div><strong>Theme</strong><small>Light / Dark</small></div><button class="btn secondary" id="settingsTheme">Change</button></div><div class="detail-row"><div><strong>Switch Role</strong><small>Welcome Screen‌కు తిరిగి వెళ్లండి</small></div><button class="btn secondary" id="switchRole">Switch</button></div><div class="detail-row"><div><strong>Logout</strong><small>ప్రస్తుత Session ముగించండి</small></div><button class="btn danger" id="logout">Logout</button></div></div></section>`;
 document.querySelector("#settingsBack").onclick=()=>{state.view="dashboard";render()};
 document.querySelector("#settingsLang").onclick=toggleLanguage;
 document.querySelector("#settingsTheme").onclick=toggleTheme;
 document.querySelector("#switchRole").onclick=()=>{state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 document.querySelector("#logout").onclick=()=>{state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
}
function superAdmin(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="superBack">← Back</button></div><section class="form-card super-card"><div class="login-symbol">⬡</div><h2>GI Super Admin</h2><p>Authorized GI Administrator Only</p><div class="field"><label>Admin ID</label><input placeholder="Admin ID"></div><div class="field"><label>Secure Password</label><input type="password" placeholder="••••••••"></div><button class="btn full" id="superContinue">Secure Login</button><div class="demo-note">Authentication placeholder — secure backend ఇంకా అనుసంధానం కాలేదు.</div></section>`;
 document.querySelector("#superBack").onclick=()=>{state.view="welcome";render()};
 document.querySelector("#superContinue").onclick=()=>toast("GI Super Admin Authentication ఇంకా సిద్ధం కాలేదు.");
}
function renderCreativeWelcome(modal){
 const te=state.lang==="te";
 const copy=te?{welcome:"స్వాగతం",godavari:"గోదావరి",creative:"క్రియేటివ్ స్పేస్",tag:"మీ ఆలోచనలు. మా సృజనాత్మకత.",intro:"ఊహ నుంచి ఆవిష్కరణ వరకు, అర్థవంతమైనదాన్ని మనమిద్దరం కలిసి సృష్టిద్దాం.",needs:"మీ డిజిటల్ అవసరాల కోసం",services:"క్రియేటివ్ వెబ్‌సైట్లు • డిజిటల్ వీడియోలు • బ్రాండింగ్ • సోషల్ మీడియా • డిజిటల్ అప్లికేషన్లు",grow:"సృష్టిద్దాం. ఎదుగుదాం.",chat:"మాతో చాట్ చేయండి",sign:"గోదావరి స్ఫూర్తితో. సృజనాత్మకతే మా బలంతో.",close:"మూసివేయి"}:{welcome:"Welcome to",godavari:"Godavari",creative:"Creative Space",tag:"Your Ideas. Our Creativity.",intro:"From imagination to innovation, let’s create something meaningful together.",needs:"For Your Digital Needs",services:"Creative Websites • Digital Videos • Branding • Social Media • Digital Applications",grow:"Let’s Create. Let’s Grow.",chat:"Chat with Us",sign:"Inspired by Godavari. Driven by Creativity.",close:"Close"};
 modal.innerHTML='<section class="gcs-welcome-card" role="dialog" aria-modal="true" aria-labelledby="gcsTitle"><button type="button" class="gcs-close" aria-label="'+copy.close+'">×</button><div class="gcs-brand"><span class="gcs-logo">GI</span><span class="gcs-brand-name">GODAVARI CREATIVE SPACE</span></div><div class="gcs-welcome-copy"><p class="gcs-overline">'+copy.welcome+'</p><h2 id="gcsTitle">'+copy.godavari+'<span>'+copy.creative+'</span></h2><h3>'+copy.tag+'</h3><p>'+copy.intro+'</p></div><div class="gcs-services"><h3>'+copy.needs+'</h3><p>'+copy.services+'</p><h3>'+copy.grow+'</h3><a class="gcs-chat" href="https://wa.me/918985361991" target="_blank" rel="noopener"><span aria-hidden="true">◉</span> '+copy.chat+'</a></div><p class="gcs-signoff">'+copy.sign+'</p></section>';
 modal.querySelector(".gcs-close").onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};
}
function contactPopup(){let modal=document.querySelector("#gcsWelcomePopup");if(!modal){modal=document.createElement("div");modal.id="gcsWelcomePopup";modal.className="gcs-welcome-overlay";document.body.append(modal)}renderCreativeWelcome(modal)}
function setupFooter(){
 const sig=document.querySelector("#footerSignature"),inspired=document.querySelector("#footerInspired");let timer=null,long=false;
 inspired.onclick=contactPopup;sig.onclick=e=>{if(long){e.preventDefault();long=false;return}contactPopup()};
 sig.onpointerdown=()=>{long=false;timer=setTimeout(()=>{long=true;state.view="superadmin";render()},850)};
 ["pointerup","pointerleave","pointercancel"].forEach(ev=>sig.addEventListener(ev,()=>clearTimeout(timer)));
}
function toast(msg){const el=document.createElement("div");el.className="toast";el.textContent=translateValue(msg);document.body.append(el);setTimeout(()=>el.remove(),2400)}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 document.querySelector("#appName").textContent="BVR - CVPMR - DNR";
 document.querySelector("#tagline").textContent="DIGITAL MANA BADI";
 const theme=document.querySelector("#themeToggle");theme.textContent=state.theme==="light"?"☾":"☀";
 document.querySelector("#languageToggle").textContent=state.lang==="te"?"అ":"A";
 document.querySelector("#languageToggle").setAttribute("aria-label",state.lang==="te"?"Switch to English":"తెలుగులోకి మార్చండి");
 theme.setAttribute("aria-label",state.theme==="light"?"Switch to dark theme":"Switch to light theme");
 if(state.view==="welcome")welcome();else if(state.view==="login")login();else if(state.view==="link")linking();else if(state.view==="dashboard")dashboard();else if(state.view==="module")modulePage();else if(state.view==="profile")profilePage();else if(state.view==="settings")settingsPage();else if(state.view==="superadmin")superAdmin();
 applyTranslations();
 updateBottomNavigation();
}
function setupBottomNavigation(){
 const nav=document.querySelector("#bottomNav");
 nav.querySelector("#navHome").onclick=()=>{state.module=null;state.view="dashboard";render()};
 nav.querySelector("#navCalendar").onclick=()=>{state.module="Events & Calendar";state.view="module";render()};
 nav.querySelector("#navProfile").onclick=()=>{state.view="profile";render()};
 nav.querySelector("#navSettings").onclick=()=>{state.view="settings";render()};
}
function updateBottomNavigation(){
 const nav=document.querySelector("#bottomNav");
 const visible=Boolean(state.role && state.authenticated);
 nav.hidden=!visible;
 document.body.classList.toggle("has-authenticated-role",visible);
 const active=state.view==="dashboard"?"navHome":state.view==="profile"?"navProfile":state.view==="settings"?"navSettings":state.view==="module" && state.module==="Events & Calendar"?"navCalendar":"";
 nav.querySelectorAll("button").forEach(button=>{
  const selected=button.id===active;
  button.classList.toggle("active",selected);
  if(selected)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");
 });
}
render();setupFooter();setupBottomNavigation();updateBottomNavigation();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
