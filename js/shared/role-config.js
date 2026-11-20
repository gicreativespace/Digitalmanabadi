export const roleNames={hm:["ప్రధానోపాధ్యాయులు","Head Master"],teacher:["ఉపాధ్యాయులు","Teachers"],parent:["తల్లిదండ్రులు","Parent"],community:["పూర్వ విద్యార్థులు & ప్రోత్సాహకులు","Alumni & Sponsors"]};
export const roleMeta={
 hm:{tone:"green",icon:"school",title:"ప్రధానోపాధ్యాయుల ప్రధాన పేజీ",sub:"పాఠశాల మొత్తం నిర్వహణ మరియు పర్యవేక్షణ"},
 teacher:{tone:"gold",icon:"presentation",title:"ఉపాధ్యాయుల ప్రధాన పేజీ",titleEn:"Teacher Dashboard",sub:"మీకు కేటాయించిన తరగతులు మరియు బోధనా పనులు",subEn:"Your assigned classes and teaching tasks"},
 parent:{tone:"blue",icon:"users",title:"తల్లిదండ్రుల ప్రధాన పేజీ",titleEn:"Parent Dashboard",sub:"మీ పిల్లల పాఠశాల సమాచారం",subEn:"Your child’s school information"},
 community:{tone:"green",icon:"heart-handshake",title:"Alumni / Donor Portal",titleTe:"పూర్వ విద్యార్థులు / దాతల పోర్టల్",titleEn:"Alumni / Donor Portal",sub:"మీ పాఠశాలతో అనుబంధం కొనసాగించండి • విద్యార్థులకు తోడ్పడండి • భవిష్యత్తును నిర్మించండి",subEn:"Connect with your school • Support students • Build the future"}
};
export const modules={
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
  ["settings","పాఠశాల సెట్టింగ్స్","School Settings","పాఠశాల ప్రాథమిక సెట్టింగ్స్"],
  ["users","Alumni / Donor Management","Alumni / Donor Management","Registration approvals and community records"],
  ["message-circle","Contact Inbox","Contact Inbox","Messages from Alumni and Donors"],
  ["clipboard-list","School Requirements","School Requirements","Post and manage school needs"],
  ["heart-handshake","Student Adoption","Student Adoption","Manage full and specific student support"],
  ["hand-coins","School Sponsorship","School Sponsorship","Manage financial and material support"],
  ["graduation-cap","Volunteer Management","Volunteer Management","Review mentoring and volunteer requests"],
  ["trophy","Merit & Excellence Awards","Merit & Excellence Awards","Last year class-wise best students and donor awards"]
 ],
 teacher:[
  ["calendar-check","హాజరు","Attendance","కేటాయించిన తరగతులకు ఉదయం / సాయంత్రం హాజరు","Morning / evening attendance for assigned classes"],
  ["notebook-pen","డైలీ డైరీ","Daily Diary","విషయాల వారీగా డైరీ నమోదు, సమర్పణ","Subject-wise diary entries and submissions"],
  ["book-open","హోంవర్క్","Homework","విద్యార్థులకు హోంవర్క్ ఇవ్వడం","Assign homework to students"],
  ["megaphone","నోటీసు బోర్డు","Notice Board","పాఠశాల నోటీసులు చూడటం","View school notices"],
  ["calendar-days","ఈవెంట్స్ & క్యాలెండర్","Events & Calendar","పాఠశాల కార్యక్రమాలు చూడటం","View school events"],
  ["utensils","మధ్యాహ్న భోజనం","Mid-Day Meal","కేటాయించిన నమోదు / పరిశీలన","Assigned meal records and review"],
  ["sun","Today Special","Today Special","పుట్టినరోజులు, ప్రత్యేక దినాలు","Birthdays and special days"],
  ["book-heart","గొప్ప వ్యక్తులు","Great People","చూడటానికి మాత్రమే","View only"],
  ["quote","గొప్ప సూక్తులు","Great Quotes","చూడటానికి మాత్రమే","View only"],
  ["palette","Poster Studio","Poster Studio","పోస్టర్ తయారీ","Create posters"]
 ],
 parent:[
  ["calendar-check","నా పిల్లల హాజరు","Attendance","రోజువారీ మరియు నెలవారీ హాజరు","Daily and monthly attendance"],
  ["notebook-pen","డైలీ డైరీ","Daily Diary","HM ఆమోదించిన డైరీ మాత్రమే","Only HM-approved diary"],
  ["book-open","హోంవర్క్","Homework","ఇచ్చిన హోంవర్క్ వివరాలు","Assigned homework details"],
  ["megaphone","నోటీసు బోర్డు","Notice Board","పాఠశాల ఆమోదించిన నోటీసులు","School-approved notices"],
  ["calendar-days","ఈవెంట్స్ & క్యాలెండర్","Events & Calendar","పాఠశాల కార్యక్రమాలు, సెలవులు","School events and holidays"],
  ["utensils","మధ్యాహ్న భోజనం","Mid-Day Meal","వాస్తవంగా వడ్డించిన భోజన వివరాలు","Details of meals actually served"],
  ["sun","Today Special","Today Special","పుట్టినరోజులు, ప్రత్యేక దినాలు","Birthdays and special days"],
  ["book-heart","గొప్ప వ్యక్తులు","Great People","చూడటానికి మాత్రమే","View only"],
  ["quote","గొప్ప సూక్తులు","Great Quotes","చూడటానికి మాత్రమే","View only"],
  ["palette","Poster Studio","Poster Studio","పోస్టర్ తయారు చేసి డౌన్‌లోడ్ చేయండి","Create and download a poster"],
  ["trophy","విద్యార్థుల ప్రతిభ","Merit & Excellence Awards","మీ పిల్లల ఆమోదిత విజయాలు","Your child’s approved achievements"]
 ],
 community:[
  ["book-heart","గొప్ప వ్యక్తులు","Great People","చూడటానికి మాత్రమే","View only"],
  ["quote","గొప్ప సూక్తులు","Great Quotes","చూడటానికి మాత్రమే","View only"],
  ["calendar-days","క్యాలెండర్","Events & Calendar","పాఠశాల కార్యక్రమాలు మరియు ముఖ్యమైన తేదీలు","School events and important dates"],
  ["school","నా పాఠశాల","My School","పాఠశాల సమాచారం మరియు తాజా విషయాలు","School information and updates"],
  ["message-circle","Head Masterను సంప్రదించండి","Contact Head Master","మీ పాఠశాలకు సందేశం పంపండి","Send a message to your school"],
  ["clipboard-list","పాఠశాల అవసరాలు","School Requirements","హెడ్ మాస్టర్ ప్రచురించిన అవసరాలను చూడండి","View needs posted by the Head Master"],
  ["hand-heart","అవసరానికి సహాయం","Support a Requirement","పాఠశాల అవసరానికి స్పందించండి","Respond to a school requirement"],
  ["heart-handshake","విద్యార్థి దత్తత","Student Adoption","పూర్తి సహాయం లేదా నిర్దిష్ట విద్యా అవసరానికి మద్దతు","Full support or a specific educational need"],
  ["hand-coins","పాఠశాల స్పాన్సర్‌షిప్","School Sponsorship","ఆర్థిక లేదా వస్తు రూపంలో సహాయం","Financial or material support"],
  ["graduation-cap","స్వచ్ఛంద సేవ","Volunteer & Mentorship","మీ సమయం, నైపుణ్యాలు మరియు అనుభవాన్ని పంచుకోండి","Share your time, skills and experience"],
  ["history","నా సహాయాలు","My Contributions","మీ సహాయాలు మరియు స్పందనల చరిత్రను చూడండి","View your support and response history"],
  ["trophy","మెరిట్ అవార్డులు","Merit & Excellence Awards","తరగతి వారీగా ఉత్తమ విద్యార్థులను చూడండి, అవార్డుకు సహాయం చేయండి","View class-wise best students and sponsor an award"]
 ]
};
