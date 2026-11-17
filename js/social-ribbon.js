/* Social Media Ribbon — additive, independent from existing app modules */
(() => {
  const SOCIAL_LINKS = {
    website: "",
    whatsapp: "",
    youtube: "",
    instagram: "",
    facebook: ""
  };
  const items = [
    { key:"website", label:"Website", icon:"https://cdn.simpleicons.org/googlechrome/34784E", alt:"Website" },
    { key:"whatsapp", label:"WhatsApp", icon:"https://cdn.simpleicons.org/whatsapp/25D366", alt:"WhatsApp" },
    { key:"youtube", label:"YouTube", icon:"https://cdn.simpleicons.org/youtube/FF0033", alt:"YouTube" },
    { key:"instagram", label:"Instagram", icon:"https://cdn.simpleicons.org/instagram/E4405F", alt:"Instagram" },
    { key:"facebook", label:"Facebook", icon:"https://cdn.simpleicons.org/facebook/0866FF", alt:"Facebook" }
  ];
  const makeRibbon = () => {
    const el = document.createElement("aside");
    el.className = "social-ribbon";
    el.id = "socialMediaRibbon";
    el.setAttribute("aria-label", "Connect with us");
    el.innerHTML = '<div class="social-ribbon-head" data-te="మనతో అనుసంధానం అవ్వండి" data-en="CONNECT WITH US">మనతో అనుసంధానం అవ్వండి</div><div class="social-ribbon-links"></div>';
    const links = el.querySelector(".social-ribbon-links");
    for (const item of items) {
      const href = SOCIAL_LINKS[item.key];
      const node = document.createElement(href ? "a" : "span");
      node.className = "social-ribbon-link";
      if (href) { node.href = href; node.target = "_blank"; node.rel = "noopener noreferrer"; }
      else { node.setAttribute("aria-disabled", "true"); node.title = item.label + " link will be added"; }
      const img = document.createElement("img");
      img.src = item.icon; img.alt = item.alt; img.loading = "lazy";
      const name = document.createElement("small");
      name.className = "social-name"; name.textContent = item.label;
      node.append(img, name); links.append(node);
    }
    return el;
  };
  let ribbon;
  let scrollTimer;
  let lastY = window.scrollY;
  let autoHidden = false;
  const syncLanguage = () => {
    if (!ribbon) return;
    const head = ribbon.querySelector(".social-ribbon-head");
    const en = document.documentElement.lang === "en";
    head.textContent = en ? "CONNECT WITH US" : "మనతో అనుసంధానం అవ్వండి";
  };
  const placeRibbon = () => {
    const main = document.getElementById("mainView");
    if (!main || !ribbon) return;
    const welcome = main.querySelector(".welcome-panel");
    const roles = main.querySelector(".role-stack");
    if (welcome && roles) {
      ribbon.classList.remove("compact");
      ribbon.classList.remove("social-auto-hidden");
      ribbon.classList.add("social-auto-visible");
      roles.insertAdjacentElement("afterend", ribbon);
    } else {
      ribbon.classList.add("compact");
      const footer = document.getElementById("appFooter");
      if (footer && footer.parentNode) footer.parentNode.insertBefore(ribbon, footer);
      else main.append(ribbon);
      if (autoHidden) ribbon.classList.add("social-auto-hidden");
      else ribbon.classList.add("social-auto-visible");
    }
    syncLanguage();
  };
  const onScroll = () => {
    const y = window.scrollY;
    const movingDown = y > lastY + 3;
    if (movingDown) {
      autoHidden = true;
      ribbon?.classList.add("social-auto-hidden");
      ribbon?.classList.remove("social-auto-visible");
    } else if (y < lastY - 3) {
      autoHidden = false;
      ribbon?.classList.remove("social-auto-hidden");
      ribbon?.classList.add("social-auto-visible");
    }
    lastY = y;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (!autoHidden && ribbon) ribbon.classList.add("social-auto-visible");
    }, 180);
  };
  const start = () => {
    if (!document.getElementById("mainView")) return;
    ribbon = makeRibbon();
    placeRibbon();
    const observer = new MutationObserver(() => placeRibbon());
    observer.observe(document.getElementById("mainView"), { childList:true, subtree:true });
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("wheel", () => { if (window.scrollY < 3) { autoHidden = false; ribbon.classList.remove("social-auto-hidden"); ribbon.classList.add("social-auto-visible"); } }, { passive:true });
    const languageObserver = new MutationObserver(syncLanguage);
    languageObserver.observe(document.documentElement, { attributes:true, attributeFilter:["lang"] });
    setTimeout(placeRibbon, 250);
    setTimeout(placeRibbon, 900);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once:true });
  else start();
})();