/* Social Media Ribbon — lightweight, additive and independent from app navigation */
(() => {
  const SOCIAL_LINKS = { website:"", whatsapp:"", youtube:"", instagram:"", facebook:"" };
  const logoData = {
    website: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#34784E" stroke-width="2"/><path d="M3.5 12h17M12 3c2.3 2.4 3.4 5.4 3.4 9s-1.1 6.6-3.4 9c-2.3-2.4-3.4-5.4-3.4-9S9.7 5.4 12 3Z" fill="none" stroke="#34784E" stroke-width="1.5"/></svg>',
    whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#25D366" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.4 22l5.2-1.3A9.8 9.8 0 1 0 12 2.2Z"/><path fill="#fff" d="M17.5 14.5c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a7.7 7.7 0 0 1-2.3-1.4 8.5 8.5 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5s0-.4 0-.5l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.3 1 2.7 1.1 2.9a11 11 0 0 0 4.3 4c.6.3 1.1.5 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4s-.2-.2-.5-.3Z"/></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0033"/><path d="m10 8.5 6 3.5-6 3.5Z" fill="#fff"/></svg>',
    instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="#E4405F" stroke-width="2.2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#E4405F" stroke-width="2.1"/><circle cx="17.6" cy="6.6" r="1.3" fill="#E4405F"/></svg>',
    facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#0866FF"/><path fill="#fff" d="M13.5 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.3-1.4 1.4-1.4h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.1V13h2.4v7Z"/></svg>'
  };
  const iconDataUrl = key => "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(logoData[key]);
  const items = [
    {key:"website",label:"Website",icon:iconDataUrl("website")},
    {key:"whatsapp",label:"WhatsApp",icon:iconDataUrl("whatsapp")},
    {key:"youtube",label:"YouTube",icon:iconDataUrl("youtube")},
    {key:"instagram",label:"Instagram",icon:iconDataUrl("instagram")},
    {key:"facebook",label:"Facebook",icon:iconDataUrl("facebook")}
  ];
  const makeRibbon = () => {
    const el=document.createElement("aside");
    el.className="social-ribbon";el.id="socialMediaRibbon";
    el.setAttribute("aria-label","Connect with us");
    el.innerHTML='<button type="button" class="social-ribbon-toggle" aria-expanded="false" aria-label="Open social links" title="Connect with us"><span aria-hidden="true">‹</span></button><div class="social-ribbon-panel"><div class="social-ribbon-head">CONNECT WITH US</div><div class="social-ribbon-links"></div></div>';
    const links=el.querySelector(".social-ribbon-links");
    for(const item of items){
      const href=SOCIAL_LINKS[item.key];
      const node=document.createElement(href?"a":"span");
      node.className="social-ribbon-link";
      if(href){node.href=href;node.target="_blank";node.rel="noopener noreferrer";}
      else{node.setAttribute("aria-disabled","true");node.title=item.label+" link will be added";}
      node.setAttribute("aria-label",item.label);
      const img=document.createElement("img");img.src=item.icon;img.alt=item.label;img.loading="eager";img.decoding="async";
      const label=document.createElement("span");label.className="social-name";label.textContent=item.label;node.append(img,label);links.append(node);
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