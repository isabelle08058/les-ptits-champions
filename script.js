const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menu) {
  menu.addEventListener("click", () => nav.classList.toggle("open"));
}

document.querySelectorAll(".nav a").forEach(a => {
  a.addEventListener("click", () => nav.classList.remove("open"));
});


/* =========================================================
   CHARGEMENT DES DONNÉES PUBLIÉES
   ========================================================= */

const DATA_URL = "site-data.json";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function splitTitle(value) {
  const parts = String(value || "").split("|");

  if (parts.length > 1) {
    return esc(parts[0]) + "<br><span>" + esc(parts.slice(1).join("|")) + "</span>";
  }

  return esc(value || "");
}


async function loadPublishedData() {
  try {
    const response = await fetch(DATA_URL + "?v=" + Date.now(), {
      cache: "no-store"
    });

    if (!response.ok) {
      return;
    }

    const d = await response.json();
    applyData(d);

  } catch (error) {
    console.log("Aucune donnée publiée supplémentaire.", error);
  }
}


/* =========================================================
   APPARENCE
   ========================================================= */

function applyAppearance(d) {
  const root = document.documentElement;

  if (d.primaryColor) {
    root.style.setProperty("--primary", d.primaryColor);
  }

  if (d.secondaryColor) {
    root.style.setProperty("--secondary", d.secondaryColor);
  }

  if (d.backgroundColor) {
    root.style.setProperty("--background", d.backgroundColor);
  }

  if (d.fontFamily) {
    document.body.style.fontFamily = d.fontFamily;
  }

  const hero = document.querySelector(".hero");

  if (hero && d.logo) {
    hero.style.backgroundImage =
      `linear-gradient(rgba(255,255,255,${d.heroOverlay || 0}),rgba(255,255,255,${d.heroOverlay || 0})),url("${d.logo}")`;

    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
  }
}


/* =========================================================
   ACCUEIL
   ========================================================= */

function applyHome(d) {
  const title = document.querySelector(".hero h1");
  const lead = document.querySelector(".hero .lead");
  const intro = document.querySelector(".hero .intro");
  const mainButton = document.querySelector(".hero .btn.primary");

  if (title && d.heroTitle) {
    title.innerHTML = splitTitle(d.heroTitle);
  }

  if (lead && d.heroLead) {
    lead.textContent = d.heroLead;
  }

  if (intro && d.heroIntro) {
    intro.innerHTML = "<strong>" + esc(d.heroIntro) + "</strong>";
  }

  if (mainButton && d.registerButton) {
    mainButton.textContent = d.registerButton;
  }

  const heroCardTitle = document.querySelector(".hero-card h2");
  const heroCardText = document.querySelector(".hero-card p");

  if (heroCardTitle && d.campTitle) {
    heroCardTitle.innerHTML = esc(d.campTitle).replace(
      " ",
      " "
    );
  }

  if (heroCardText && d.campDescription) {
    heroCardText.textContent = d.campDescription;
  }

  const age = document.querySelector(".hero-card .age");

  if (age) {
    age.textContent =
      (d.miniAge || "5–7 ans") + " · " +
      (d.bigAge || "8–10 ans");
  }
}


/* =========================================================
   CAMP
   ========================================================= */

function applyCamp(d) {
  const section = document.querySelector("#camp");

  if (!section) return;

  const heading = section.querySelector(".section-heading h2");
  const cards = section.querySelector(".cards");

  if (heading && d.campTitle) {
    heading.textContent = d.campTitle;
  }

  const description = section.querySelector(".section-heading p");

  if (description && d.campDescription) {
    description.textContent = d.campDescription;
  }

  if (cards && Array.isArray(d.cards)) {
    cards.innerHTML = d.cards.map(card => `
      <article class="card">
        <div class="icon">${esc(card[0] || "✨")}</div>
        <h3>${esc(card[1] || "")}</h3>
        <p>${esc(card[2] || "")}</p>
      </article>
    `).join("");
  }
}


/* =========================================================
   GROUPES
   ========================================================= */

function applyGroups(d) {
  const mini = document.querySelector("#groupes .mini");
  const big = document.querySelector("#groupes .grands");

  if (mini) {
    const h = mini.querySelector("h3");
    const age = mini.querySelector(".age-label");
    const p = mini.querySelector("p:not(.age-label)");

    if (h) h.textContent = d.miniTitle || "";
    if (age) age.textContent = d.miniAge || "";
    if (p) p.textContent = d.miniText || "";
  }

  if (big) {
    const h = big.querySelector("h3");
    const age = big.querySelector(".age-label");
    const p = big.querySelector("p:not(.age-label)");

    if (h) h.textContent = d.bigTitle || "";
    if (age) age.textContent = d.bigAge || "";
    if (p) p.textContent = d.bigText || "";
  }
}


/* =========================================================
   ACTIVITÉS
   ========================================================= */

function applyActivities(d) {
  const grid = document.querySelector("#activites .activity-grid");

  if (!grid || !Array.isArray(d.activities)) return;

  grid.innerHTML = d.activities.map(a => `
    <div>
      ${esc(a[0] || "✨")}
      <strong>${esc(a[1] || "")}</strong>
      <small>${esc(a[2] || "")}</small>
    </div>
  `).join("");
}


/* =========================================================
   DATES ET TARIFS
   ========================================================= */

function applyDates(d) {
  const section = document.querySelector("#dates");

  if (!section) return;

  const grid = section.querySelector(".dates-grid");

  if (grid && Array.isArray(d.weeks)) {
    grid.innerHTML = d.weeks.map((week, i) => `
      <div class="date-card">
        <span>Semaine ${i + 1}</span>
        <strong>${esc(week)}</strong>
      </div>
    `).join("");
  }

  const headingParagraph = section.querySelector(".section-heading p");

  if (headingParagraph && d.deadline) {
    headingParagraph.innerHTML =
      "Inscriptions ouvertes jusqu’au <strong>" +
      esc(d.deadline) +
      "</strong>, dans la limite des places disponibles.";
  }

  const priceBox = section.querySelector(".price-box");

  if (priceBox && Array.isArray(d.prices)) {
    priceBox.innerHTML = d.prices.map(price => `
      <div>
        <span>${esc(price.label || "")}</span>
        <strong>${esc(price.amount || "")}</strong>
      </div>
    `).join("");
  }

  const payment = section.querySelector(".payment");

  if (payment && d.payment) {
    payment.innerHTML =
      "<strong>Paiement :</strong> " + esc(d.payment);
  }
}


/* =========================================================
   JOURNÉE
   ========================================================= */

function applySchedule(d) {
  const timeline = document.querySelector(".timeline");

  if (!timeline || !Array.isArray(d.schedule)) return;

  timeline.innerHTML = d.schedule.map(item => `
    <div>
      <b>${esc(item[0] || "")}</b>
      <span>${esc(item[1] || "")}</span>
    </div>
  `).join("");
}


/* =========================================================
   CONTENU SUPPLÉMENTAIRE
   ========================================================= */

function makeExtraContainer() {
  let container = document.querySelector("#published-extra");

  if (!container) {
    container = document.createElement("div");
    container.id = "published-extra";

    const registration = document.querySelector("#inscription");

    if (registration) {
      registration.parentNode.insertBefore(container, registration);
    } else {
      document.querySelector("main").appendChild(container);
    }
  }

  return container;
}


function renderExtraSections(d) {
  const container = makeExtraContainer();

  let html = "";

  if (d.importantInfo) {
    html += `
      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">INFORMATIONS IMPORTANTES</span>
          <h2>À savoir avant le camp</h2>
        </div>
        <div class="previewBox">
          ${String(d.importantInfo).replaceAll("\n", "<br>")}
        </div>
      </section>
    `;
  }


  if (d.localAddress || d.localText || (d.localPhotos && d.localPhotos.length)) {
    html += `
      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">LE LOCAL</span>
          <h2>${esc(d.localAddress || "Notre lieu d’accueil")}</h2>
        </div>
        ${d.localText ? `<p>${esc(d.localText)}</p>` : ""}
        <div class="cards three">
          ${(d.localPhotos || []).map(p => `
            <article class="card">
              ${p.src ? `<img src="${p.src}" alt="${esc(p.caption || "")}" style="width:100%;border-radius:12px">` : ""}
              ${p.caption ? `<p>${esc(p.caption)}</p>` : ""}
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }


  if (Array.isArray(d.programs) && d.programs.length) {
    html += `
      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">PROGRAMMES</span>
          <h2>Programme des semaines</h2>
        </div>
        <div class="cards two">
          ${d.programs.map(p => `
            <article class="card">
              <h3>${esc(p.week || "")}</h3>
              ${p.src ? `<img src="${p.src}" alt="" style="width:100%;border-radius:12px">` : ""}
              <p>${esc(p.text || "")}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }


  if (Array.isArray(d.photos) && d.photos.length) {
    html += `
      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">PHOTOS</span>
          <h2>Quelques souvenirs</h2>
        </div>
        <div class="cards three">
          ${d.photos.map(p => `
            <article class="card">
              ${p.src ? `<img src="${p.src}" alt="${esc(p.caption || "")}" style="width:100%;border-radius:12px">` : ""}
              ${p.caption ? `<p>${esc(p.caption)}</p>` : ""}
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }


  if ((d.founders && d.founders.length) || (d.monitors && d.monitors.length)) {
    const people = [...(d.founders || []), ...(d.monitors || [])];

    html += `
      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">NOTRE ÉQUIPE</span>
          <h2>Les personnes qui encadrent le camp</h2>
        </div>
        <div class="cards three">
          ${people.map(p => `
            <article class="card">
              ${p.photo ? `<img src="${p.photo}" alt="" style="width:100%;border-radius:50%">` : ""}
              <h3>${esc(p.name || "")}</h3>
              <strong>${esc(p.role || "")}</strong>
              <p>${esc(p.text || "")}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }


  if (Array.isArray(d.docs) && d.docs.some(x => x[1])) {
    html += `
      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">DOCUMENTS</span>
          <h2>Documents utiles</h2>
        </div>
        <div class="cards two">
          ${d.docs.filter(x => x[1]).map(x => `
            <article class="card">
              <h3>${esc(x[0] || "Document")}</h3>
              <a class="btn secondary" href="${x[1]}" target="_blank" rel="noopener">
                Ouvrir le document
              </a>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  container.innerHTML = html;
}


/* =========================================================
   FAQ
   ========================================================= */

function applyFAQ(d) {
  const faq = document.querySelector("#faq .faq");

  if (!faq || !Array.isArray(d.faq)) return;

  faq.innerHTML = d.faq.map(item => `
    <details>
      <summary>${esc(item[0] || "")}</summary>
      <p>${esc(item[1] || "")}</p>
    </details>
  `).join("");
}


/* =========================================================
   PIED DE PAGE
   ========================================================= */

function applyFooter(d) {
  const footer = document.querySelector("footer");

  if (!footer) return;

  const strong = footer.querySelector(".footer-brand strong");

  if (strong && d.footerText) {
    strong.textContent = d.footerText;
  }
}


/* =========================================================
   APPLICATION GÉNÉRALE
   ========================================================= */

function applyData(d) {
  applyAppearance(d);
  applyHome(d);
  applyCamp(d);
  applyGroups(d);
  applyActivities(d);
  applyDates(d);
  applySchedule(d);
  applyFAQ(d);
  applyFooter(d);
  renderExtraSections(d);

  document.title =
    (d.campName || "Les p’tits champions de Terre-Sainte") +
    " | Camp fun et aventure à Founex";
}


loadPublishedData();
