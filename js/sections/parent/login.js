export function getParentLoginView({T}) {
 return {kind:"parent",description:T("మీ Student ID మరియు Parent PINతో ప్రవేశించండి.","Sign in with your Student ID and Parent PIN."),formMarkup:'<div class="field"><label>Student ID</label><input id="loginId" placeholder="Student ID"></div><div class="field"><label>Parent PIN</label><input id="loginPin" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit PIN"></div><button class="btn full" id="loginGo">Login</button><div class="link-row"><button class="text-link" id="startLink">మొదటిసారి? పిల్లలను లింక్ చేయండి</button></div>'};
}
