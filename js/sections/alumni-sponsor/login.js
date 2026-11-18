export function getAlumniSponsorLoginView({T}) {
 return {
  kind:"community",
  eyebrow:"SCHOOL COMMUNITY",
  title:T("పూర్వ విద్యార్థి / స్పాన్సర్","Alumni & Sponsor"),
  visualNote:T("మీ పాఠశాలతో అనుబంధం కొనసాగించండి. భవిష్యత్తుకు తోడ్పడండి.","Stay connected with your school. Help shape its future."),
  description:T("మీ అనుబంధాన్ని కొనసాగించడానికి లేదా సహకారం అందించడానికి ఎంచుకోండి.","Choose how you would like to stay connected or contribute."),
  formMarkup:'<div class="community-access-actions"><button class="btn full role-login-submit" id="communityRegister">'+T("నమోదు చేసుకోండి","Register")+'</button><button class="btn secondary full" id="communityPreview">'+T("Portal Preview తెరవండి","Open Portal Preview")+'</button></div><div class="demo-note">Preview only — registration approval, secure sign-in and cross-device messaging ఇంకా Firebaseతో live కాలేదు.</div>'
 };
}
