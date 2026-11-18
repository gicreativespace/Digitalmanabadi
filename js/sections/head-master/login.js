export function getHeadMasterLoginView({T}) {
 return {
  kind:"credentials",
  eyebrow:"SCHOOL LEADERSHIP",
  title:T("ప్రధానోపాధ్యాయుల ప్రవేశం","Head Master Access"),
  visualNote:T("పాఠశాల నిర్వహణకు ఒకే సురక్షిత ప్రవేశం.","One secure gateway for school leadership."),
  description:T("మీ పాఠశాల అధికారిక ఖాతా వివరాలతో ప్రవేశించండి.","Sign in with your official school account credentials."),
  formMarkup:'<div class="field"><label for="loginId">'+T("అధికారిక పాఠశాల Email","Official School Email")+'</label><input id="loginId" type="email" autocomplete="username" placeholder="'+T("మీ పాఠశాల Email నమోదు చేయండి","Enter your official school email")+'"></div><div class="field"><label for="loginPin">'+T("Password","Password")+'</label><input id="loginPin" type="password" autocomplete="current-password" placeholder="••••••••"></div><button class="btn full role-login-submit" id="loginGo">'+T("సురక్షితంగా ప్రవేశించండి","Secure Login")+'</button><div class="demo-note">Firebase Authenticationతో Head Master Email, ఖాతా స్థితి ధృవీకరించబడతాయి.</div>'
 };
}
