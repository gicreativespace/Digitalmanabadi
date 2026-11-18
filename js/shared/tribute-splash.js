import { APP_CONFIG } from "../../config/school-config.js";

const portraitAssets = [
  {
    src: "./assets/branding/tribute/b-v-raju.jpg",
    name: "Sri B. V. Raju"
  },
  {
    src: "./assets/branding/tribute/c-v-p-murthy-raju.jpg",
    name: "Sri C. V. P. Murthy Raju"
  },
  {
    src: "./assets/branding/tribute/d-n-raju.jpg",
    name: "Sri Dantuluri Narayana Raju"
  }
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export function showTributeSplash(onComplete, duration = 3000) {
  const schoolName = escapeHtml(APP_CONFIG.schoolName || "");
  const schoolLocation = escapeHtml(
    (APP_CONFIG.schoolAddress || APP_CONFIG.schoolLocation || "").replace(",", " ·")
  );

  const overlay = document.createElement("section");
  overlay.className = "tribute-splash";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "A humble tribute");
  overlay.setAttribute("aria-modal", "true");

  overlay.innerHTML = `
    <div class="tribute-splash__inner">
      <header class="tribute-splash__heading">
        <p class="tribute-splash__eyebrow">A HUMBLE TRIBUTE</p>
        <p class="tribute-splash__telugu">కృతజ్ఞతాపూర్వక గౌరవ నివాళి</p>
      </header>

      <div class="tribute-splash__portraits">
        ${portraitAssets.map(person => `
          <figure class="tribute-splash__person">
            <div class="tribute-splash__frame">
              <img src="${person.src}" alt="${escapeHtml(person.name)}" decoding="async" fetchpriority="high">
            </div>
            <figcaption>${escapeHtml(person.name)}</figcaption>
          </figure>
        `).join("")}
      </div>

      <div class="tribute-splash__dedication">
        <p lang="te">విద్యారంగానికి, సమాజానికి వారు అందించిన అమూల్యమైన సేవలకు కృతజ్ఞతాభావంతో, ఈ డిజిటల్ విద్యా వేదికను వారికి గౌరవపూర్వకంగా అంకితం చేస్తున్నాము.</p>
        <p lang="en">With heartfelt gratitude for their invaluable contributions to education and society, we respectfully dedicate this digital learning platform to them.</p>
      </div>

      <div class="tribute-splash__identity">
        <p class="tribute-splash__initials">BVR · CVPMR · DNR</p>
        <p class="tribute-splash__app-name">DIGITAL MANA BADI</p>
        <p class="tribute-splash__app-name-te">మన బడి</p>
        <p class="tribute-splash__school-name">${schoolName}</p>
        <p class="tribute-splash__school-location">${schoolLocation}</p>
        <p class="tribute-splash__tagline">మన బాధ్యత… మన భవిష్యత్తు!</p>
        <p class="tribute-splash__tagline-en">Our Future… Our Pride!</p>
      </div>

      <footer class="tribute-splash__footer">A GI Creative Space work</footer>
    </div>
  `;

  const mountTribute = () => {
    document.body.append(overlay);
    document.body.classList.add("tribute-splash-active");
    document.body.classList.remove("tribute-splash-pending");

    window.setTimeout(() => {
      overlay.classList.add("tribute-splash--leaving");
      window.setTimeout(() => {
        overlay.remove();
        document.body.classList.remove("tribute-splash-active");
        if (typeof onComplete === "function") onComplete();
      }, 180);
    }, Math.max(0, duration));
  };

  if (window.matchMedia("(max-width: 600px)").matches) {
    const brandSplash = document.createElement("section");
    brandSplash.className = "brand-opening-splash";
    brandSplash.setAttribute("aria-label", "Digital Mana Badi");
    brandSplash.innerHTML = `
      <img class="brand-opening-splash__logo" src="./assets/branding/digital-mana-badi-logo.png" alt="Digital Mana Badi" fetchpriority="high">
      <h1 class="brand-opening-splash__title">DIGITAL MANA BADI</h1>
      <p class="brand-opening-splash__tagline">మన బడి · మన బాధ్యత… మన భవిష్యత్తు!</p>
      <p class="brand-opening-splash__loading">Loading…</p>
    `;
    document.body.append(brandSplash);
    document.body.classList.remove("tribute-splash-pending");
    window.setTimeout(() => {
      brandSplash.classList.add("brand-opening-splash--leaving");
      window.setTimeout(() => {
        brandSplash.remove();
        mountTribute();
      }, 160);
    }, 650);
  } else {
    mountTribute();
  }
}
