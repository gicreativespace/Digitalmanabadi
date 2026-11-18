export function getParentLoginView({T}) {
 return {
  kind:"parent",
  eyebrow:"FAMILY & SCHOOL",
  title:T("తల్లిదండ్రుల ప్రవేశం","Parent Connect"),
  visualNote:T("మీ పిల్లల పాఠశాల ప్రయాణాన్ని దగ్గరగా తెలుసుకోండి.","Stay connected with your child's school journey."),
  description:T("లింక్ చేసిన విద్యార్థి వివరాలతో కొనసాగండి.","Continue using your linked student details."),
  formMarkup:'<div class="field"><label for="loginId">Student ID</label><input id="loginId" autocomplete="username" placeholder="Enter Student ID"></div><div class="field"><label for="loginPin">Parent PIN</label><input id="loginPin" type="password" inputmode="numeric" maxlength="4" autocomplete="current-password" placeholder="4-digit PIN"></div><button class="btn full role-login-submit" id="loginGo">'+T("ప్రవేశించండి","Sign In")+'</button><div class="link-row"><button class="text-link" id="startLink">'+T("మొదటిసారి? పిల్లలను లింక్ చేయండి","First time? Link your child")+'</button></div><div class="demo-note">Parent linking మరియు sign-in ప్రస్తుతం ఈ browserలో Preview Modeలో మాత్రమే పనిచేస్తాయి.</div>'
 };
}
