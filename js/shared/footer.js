export function createFooterController({state,T,render}) {
function renderCreativeWelcome(modal){
 const te=state.lang==="te";
 const copy=te?{welcome:"స్వాగతం",godavari:"గోదావరి",creative:"క్రియేటివ్ స్పేస్",tag:"మీ ఆలోచనలు. మా సృజనాత్మకత.",intro:"ఊహ నుంచి ఆవిష్కరణ వరకు, అర్థవంతమైనదాన్ని మనమిద్దరం కలిసి సృష్టిద్దాం.",needs:"మీ డిజిటల్ అవసరాల కోసం",services:"క్రియేటివ్ వెబ్‌సైట్లు • డిజిటల్ వీడియోలు • బ్రాండింగ్ • సోషల్ మీడియా • డిజిటల్ అప్లికేషన్లు",grow:"సృష్టిద్దాం. ఎదుగుదాం.",chat:"మాతో చాట్ చేయండి",sign:"గోదావరి స్ఫూర్తితో. సృజనాత్మకతే మా బలంతో.",close:"మూసివేయి"}:{welcome:"Welcome to",godavari:"Godavari",creative:"Creative Space",tag:"Your Ideas. Our Creativity.",intro:"From imagination to innovation, let’s create something meaningful together.",needs:"For Your Digital Needs",services:"Creative Websites • Digital Videos • Branding • Social Media • Digital Applications",grow:"Let’s Create. Let’s Grow.",chat:"Chat with Us",sign:"Inspired by Godavari. Driven by Creativity.",close:"Close"};
 modal.innerHTML='<section class="gcs-welcome-card" role="dialog" aria-modal="true" aria-labelledby="gcsTitle"><button type="button" class="gcs-close" aria-label="'+copy.close+'">×</button><div class="gcs-brand"><img class="gcs-logo-image" src="assets/branding/gi-creative-space-logo.jpg" alt="GI Creative Space logo"><span class="gcs-brand-name">GODAVARI CREATIVE SPACE</span></div><div class="gcs-welcome-copy"><p class="gcs-overline">'+copy.welcome+'</p><h2 id="gcsTitle">'+copy.godavari+'<span>'+copy.creative+'</span></h2><h3>'+copy.tag+'</h3><p>'+copy.intro+'</p></div><div class="gcs-services"><h3>'+copy.needs+'</h3><p>'+copy.services+'</p><h3>'+copy.grow+'</h3><a class="gcs-chat" href="https://wa.me/918985361991" target="_blank" rel="noopener"><span aria-hidden="true">◉</span> '+copy.chat+'</a></div><p class="gcs-signoff">'+copy.sign+'</p></section>';
 modal.querySelector(".gcs-close").onclick=()=>modal.remove();
 modal.onclick=e=>{if(e.target===modal)modal.remove()};
}
function contactPopup(){
 let modal=document.querySelector("#gcsWelcomePopup");
 if(!modal){modal=document.createElement("div");modal.id="gcsWelcomePopup";modal.className="gcs-welcome-overlay";document.body.append(modal)}
 renderCreativeWelcome(modal);
}
function setupFooter(){
 const footer=document.querySelector("#appFooter");
 if(!footer)return;
 let pressTimer=null,pressPointer=null,startX=0,startY=0,suppressNextClick=false;
 const clearPress=()=>{
  if(pressTimer!==null)clearTimeout(pressTimer);
  pressTimer=null;pressPointer=null;
 };
 footer.addEventListener("pointerdown",event=>{
  if(!event.target.closest(".footer-link"))return;
  if(event.pointerType==="mouse"&&event.button!==0)return;
  clearPress();suppressNextClick=false;
  pressPointer=event.pointerId;startX=event.clientX;startY=event.clientY;
  pressTimer=setTimeout(()=>{
   suppressNextClick=true;
   document.querySelector("#gcsWelcomePopup")?.remove();
   state.view="superadmin";render();
  },850);
 });
 footer.addEventListener("pointermove",event=>{
  if(pressPointer!==event.pointerId)return;
  if(Math.hypot(event.clientX-startX,event.clientY-startY)>12)clearPress();
 });
 ["pointerup","pointercancel","pointerleave"].forEach(type=>footer.addEventListener(type,clearPress));
 footer.addEventListener("selectstart",event=>event.preventDefault());
 footer.addEventListener("contextmenu",event=>event.preventDefault());
 footer.addEventListener("click",event=>{
  if(!event.target.closest(".footer-link"))return;
  if(suppressNextClick){suppressNextClick=false;event.preventDefault();event.stopPropagation();return}
  contactPopup();
 });
 document.addEventListener("keydown",event=>{
  if(event.key==="Escape")document.querySelector("#gcsWelcomePopup")?.remove();
 });
}
 return {renderCreativeWelcome,setup:setupFooter};
}
