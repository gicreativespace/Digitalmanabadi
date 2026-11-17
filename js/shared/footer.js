export function createFooterController({state,T,render}) {
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
 return {renderCreativeWelcome,setup:setupFooter};
}
