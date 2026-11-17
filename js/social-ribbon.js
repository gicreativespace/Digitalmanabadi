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
    el.innerHTML='<div class="social-ribbon-head">మనతో అనుసంధానం అవ్వండి</div><div class="social-ribbon-links"></div>';
    const links=el.querySelector(".social-ribbon-links");
    for(const item of items){
      const href=SOCIAL_LINKS[item.key];
      const node=document.createElement(href?"a":"span");
      node.className="social-ribbon-link";
      if(href){node.href=href;node.target="_blank";node.rel="noopener noreferrer";}
      else{node.setAttribute("aria-disabled","true");node.title=item.label+" link will be added";}
      const img=document.createElement("img");img.src=item.icon;img.alt=item.label;img.loading="lazy";
      const name=document.createElement("small");name.className="social-name";name.textContent=item.label;
      node.append(img,name);links.append(node);
    }
    return el;
  };
  let ribbon,autoHidden=false,lastY=window.scrollY;
  const syncLanguage=()=>{
    if(!ribbon)return;
    const head=ribbon.querySelector(".social-ribbon-head");
    const next=document.documentElement.lang==="en"?"CONNECT WITH US":"మనతో అనుసంధానం అవ్వండి";
    if(head.textContent!==next)head.textContent=next;
  };
  const placeRibbon=()=>{
    const main=document.getElementById("mainView");if(!main||!ribbon)return;
    const welcome=main.querySelector(".welcome-panel"),roles=main.querySelector(".role-stack");
    if(welcome&&roles){
      ribbon.classList.remove("compact","social-auto-hidden");
      ribbon.classList.add("social-auto-visible");
      if(ribbon.parentElement!==main||roles.nextElementSibling!==ribbon)roles.insertAdjacentElement("afterend",ribbon);
    }else{
      ribbon.classList.add("compact");
      const footer=document.getElementById("appFooter");
      if(footer&&footer.parentNode){
        if(ribbon.parentNode!==footer.parentNode||ribbon.nextElementSibling!==footer)footer.parentNode.insertBefore(ribbon,footer);
      }else if(ribbon.parentElement!==main)main.append(ribbon);
      ribbon.classList.toggle("social-auto-hidden",autoHidden);
      ribbon.classList.toggle("social-auto-visible",!autoHidden);
    }
    syncLanguage();
  };
  const onScroll=()=>{
    const y=window.scrollY;
    if(y>lastY+3){autoHidden=true;ribbon?.classList.add("social-auto-hidden");ribbon?.classList.remove("social-auto-visible");}
    else if(y<lastY-3){autoHidden=false;ribbon?.classList.remove("social-auto-hidden");ribbon?.classList.add("social-auto-visible");}
    lastY=y;
  };
  const start=()=>{
    const main=document.getElementById("mainView");if(!main)return;
    ribbon=makeRibbon();placeRibbon();
    /* Observe only direct page renders, never the ribbon's own inner content. */
    const observer=new MutationObserver(()=>placeRibbon());
    observer.observe(main,{childList:true,subtree:false});
    window.addEventListener("scroll",onScroll,{passive:true});
    new MutationObserver(syncLanguage).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();