/* Social Media Ribbon — lightweight, additive and independent from app navigation */
(() => {
  const SOCIAL_LINKS = { website:"", whatsapp:"", youtube:"", instagram:"", facebook:"" };
  const items = [
    {key:"website",label:"Website",icon:"https://cdn.simpleicons.org/googlechrome/34784E"},
    {key:"whatsapp",label:"WhatsApp",icon:"https://cdn.simpleicons.org/whatsapp/25D366"},
    {key:"youtube",label:"YouTube",icon:"https://cdn.simpleicons.org/youtube/FF0033"},
    {key:"instagram",label:"Instagram",icon:"https://cdn.simpleicons.org/instagram/E4405F"},
    {key:"facebook",label:"Facebook",icon:"https://cdn.simpleicons.org/facebook/0866FF"}
  ];
  const makeRibbon = () => {
    const el=document.createElement("aside");
    el.className="social-ribbon";el.id="socialMediaRibbon";
    el.setAttribute("aria-label","Connect with us");
    el.innerHTML='<button type="button" class="social-ribbon-toggle" aria-expanded="false" aria-label="Open social links" title="Connect with us"><span aria-hidden="true">‹</span></button><div class="social-ribbon-panel"><div class="social-ribbon-links"></div></div>';
    const links=el.querySelector(".social-ribbon-links");
    for(const item of items){
      const href=SOCIAL_LINKS[item.key];
      const node=document.createElement(href?"a":"span");
      node.className="social-ribbon-link";
      if(href){node.href=href;node.target="_blank";node.rel="noopener noreferrer";}
      else{node.setAttribute("aria-disabled","true");node.title=item.label+" link will be added";}
      node.setAttribute("aria-label",item.label);
      const img=document.createElement("img");img.src=item.icon;img.alt=item.label;img.loading="lazy";
      node.append(img);links.append(node);
    }
    const toggle=el.querySelector(".social-ribbon-toggle");
    toggle.addEventListener("click",()=>{
      const expanded=el.classList.toggle("is-expanded");
      toggle.setAttribute("aria-expanded",String(expanded));
      toggle.setAttribute("aria-label",expanded?"Close social links":"Open social links");
      toggle.querySelector("span").textContent=expanded?"›":"‹";
    });
    return el;
  };
  let ribbon,placement="";
  const placeRibbon=()=>{
    const main=document.getElementById("mainView");if(!main||!ribbon)return;
    const welcome=main.querySelector(".welcome-panel"),roles=main.querySelector(".role-stack");
    if(welcome&&roles){
      if(placement!=="welcome"){ribbon.classList.remove("compact","is-expanded");placement="welcome";}
      ribbon.classList.add("social-auto-visible");
      if(ribbon.parentElement!==main||roles.nextElementSibling!==ribbon)roles.insertAdjacentElement("afterend",ribbon);
    }else{
      if(placement!=="side"){ribbon.classList.remove("is-expanded");placement="side";}
      ribbon.classList.add("compact","social-auto-hidden");
      ribbon.classList.remove("social-auto-visible");
      if(ribbon.parentElement!==document.body)document.body.append(ribbon);
    }
  };
  const start=()=>{
    const main=document.getElementById("mainView");if(!main)return;
    ribbon=makeRibbon();placeRibbon();
    /* Observe only direct page renders, never the ribbon's own inner content. */
    const observer=new MutationObserver(()=>placeRibbon());
    observer.observe(main,{childList:true,subtree:false});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();