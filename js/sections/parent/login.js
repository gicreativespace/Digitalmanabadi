export function getParentLoginView({T}) {
 const t=T||((a,b)=>a);
 return {
  kind:"parent",
  description:t("పాఠశాల అందించిన Parent Login ID మరియు Passwordతో కొనసాగండి.","Sign in with the Parent Login ID and temporary password provided by the school."),
  formMarkup:'<div class="field"><label for="loginId">'+t("Parent Login ID","Parent Login ID")+'</label><input id="loginId" type="text" inputmode="numeric" autocomplete="username" placeholder="9876543210" maxlength="10"></div><div class="field"><label for="loginPassword">'+t("Password","Password")+'</label><input id="loginPassword" type="password" autocomplete="current-password"></div><button class="btn full" id="loginGo">'+t("సురక్షితంగా ప్రవేశించండి","Sign In Securely")+'</button><p class="role-login-hint">'+t("మొదటి Login తర్వాత మీ 4 అంకెల PIN సెట్ చేసుకోవచ్చు.","Set your 4-digit PIN after your first sign-in.")+'</p>'
 };
}