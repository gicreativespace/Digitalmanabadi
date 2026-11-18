export function getTeacherLoginView({T}) {
 return {
  kind:"credentials",
  eyebrow:"TEACHING & LEARNING",
  title:T("ఉపాధ్యాయుల ప్రవేశం","Teacher Workspace"),
  visualNote:T("మీ తరగతులు, బోధన, విద్యార్థుల పురోగతికి ఒకే వేదిక.","Your space for classes, teaching and student progress."),
  description:T("మీకు కేటాయించిన పాఠశాల Login IDతో కొనసాగండి.","Continue with your assigned school Login ID."),
  formMarkup:'<div class="field"><label for="loginId">'+T("ఉపాధ్యాయ Login ID","Teacher Login ID")+'</label><input id="loginId" type="text" autocomplete="username" placeholder="'+T("మీ Login ID నమోదు చేయండి","Enter your Login ID")+'"></div><div class="field"><label for="loginPin">'+T("Password / PIN","Password / PIN")+'</label><input id="loginPin" type="password" autocomplete="current-password" placeholder="••••••••"></div><button class="btn full role-login-submit" id="loginGo">'+T("ప్రవేశించండి","Sign In")+'</button><div class="demo-note">Preview Mode — Teacher Firebase Authentication ఇంకా అనుసంధానం కాలేదు.</div>'
 };
}
