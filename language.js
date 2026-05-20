/* =========================================================
   Language + interaction logic
   Computer Vision Lab — Nara Women's University
   ========================================================= */

const langData = {
  'en': {
    // Brand
    'brandName':       "Computer Vision Lab",
    'brandSub':        "Nara Women's University, Japan",
    // Nav
    'navOverview':     "Overview",
    'navMembers':      "Members",
    'navResearch':     "Research",
    'navPublications': "Publications",
    // Hero slides — meta labels sync with slide index
    'heroSlides': [
      { meta: "01 / 03 · UNDERWATER VISION" },
      { meta: "02 / 03 · AGRICULTURAL DIGITAL TWIN" },
      { meta: "03 / 03 · 3D VISION FOR ARTS" }
    ],
    // Index page
    'newsTitle':       "News",
    'piLabel':         "Principal Investigator",
    'piName':          "Meng-Yu Jennifer Kuo",
    'piRole':          "Ph.D. in Informatics (Kyoto University)",
    'piPlace':         "Assistant Professor · Nara Women's University, Japan",
    'newsItems': [
      { date: "OCT 2025", text: "Officially launched the lab!" }
    ],
    // Members page
    'membersLead':     "We are actively recruiting undergraduate and graduate students to join our lab! ✦",
    'undergradTitle':  "Undergraduate Students",
    // Research page
    'researchLabel':   "What we work on",
    'researchLead':    "We work at the intersection of 3D vision, computational photography, and applied AI — building systems that see, measure, and reconstruct the physical world.",
    'researchCaption': "Research areas — overview diagram",
    // Publications page
    'pubEmptyTitle':   "TBD"
  },
  'ja': {
    'brandName':       "コンピュータビジョン研究室",
    'brandSub':        "<国立>奈良女子大学",
    'navOverview':     "概要",
    'navMembers':      "メンバー",
    'navResearch':     "研究",
    'navPublications': "業績",
    'heroSlides': [
      { meta: "01 / 03 · 水中ビジョン" },
      { meta: "02 / 03 · 農業デジタルツイン" },
      { meta: "03 / 03 · 芸術のための3Dビジョン" }
    ],
    'newsTitle':       "ニュース",
    'piLabel':         "研究室代表者",
    'piName':          "Meng-Yu Jennifer Kuo",
    'piRole':          "博士（京都大学・情報学）",
    'piPlace':         "助教 ・ 奈良女子大学",
    'newsItems': [
      { date: "2025年10月", text: "研究室を正式に立ち上げました。" }
    ],
    'membersLead':     "学部生・大学院生を積極的に募集しています！ ✦",
    'undergradTitle':  "学部",
    'researchLabel':   "研究内容",
    'researchLead':    "3Dビジョン、コンピュテーショナルフォトグラフィ、応用AIの境界領域で、物理世界を「見て・測り・再構成する」システムを構築しています。",
    'researchCaption': "研究領域 — 概要図",
    'pubEmptyTitle':   "TBD"
  }
};

/* ---------- Language switching ---------- */
function switchLanguage(lang, event) {
  if (event) event.preventDefault();
  localStorage.setItem('currentLang', lang);
  updateContent(lang);
  updateLangSwitcherActive(lang);
  document.documentElement.lang = lang;
}

function updateLangSwitcherActive(lang) {
  document.querySelectorAll('.language-switcher a').forEach(a => {
    a.classList.toggle('active', a.dataset.lang === lang);
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.textContent = value;
}

function updateContent(lang) {
  const d = langData[lang];
  if (!d) return;

  // Brand & nav (present on every page)
  setText('brandName', d.brandName);
  setText('brandSub',  d.brandSub);
  setText('navOverview',     d.navOverview);
  setText('navMembers',      d.navMembers);
  setText('navResearch',     d.navResearch);
  setText('navPublications', d.navPublications);

  // Index page
  setText('newsTitle', d.newsTitle);
  setText('piLabel',   d.piLabel);
  setText('piName',    d.piName);
  setText('piRole',    d.piRole);
  setText('piPlace',   d.piPlace);

  // News list (dynamic)
  const newsList = document.getElementById('newsList');
  if (newsList && Array.isArray(d.newsItems)) {
    newsList.innerHTML = d.newsItems.map(n => `
      <li>
        <span class="news-date">${n.date}</span>
        <span class="news-text">${n.text}</span>
      </li>
    `).join('');
  }

  // Members page
  setText('membersLead',    d.membersLead);
  setText('undergradTitle', d.undergradTitle);

  // Research page
  setText('researchLabel', d.researchLabel);
  setText('researchLead',  d.researchLead);
  setText('researchCaption', d.researchCaption);

  const researchImage = document.getElementById('researchImage');
  if (researchImage) {
    researchImage.src = (lang === 'ja')
      ? 'assets/images/lab_intro_ja.png'
      : 'assets/images/lab_intro_en.png';
  }

  // Publications page
  setText('pubEmptyTitle', d.pubEmptyTitle);

  // Hero overlay — sync to current slide
  updateHeroOverlay(lang);
}

/* Back-compat shims for old inline handlers */
function returnToOverview()    { updateContent(localStorage.getItem('currentLang') || 'en'); }
function returnToMembers()     { updateContent(localStorage.getItem('currentLang') || 'en'); }
function returnToResearch()    { updateContent(localStorage.getItem('currentLang') || 'en'); }
function returnToPublications(){ updateContent(localStorage.getItem('currentLang') || 'en'); }

/* ---------- Slideshow ---------- */
var slideIndex = 1;
var slideTimer;

function plusSlides(n) {
  clearTimeout(slideTimer);
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  clearTimeout(slideTimer);
  showSlides(slideIndex = n);
}

function showSlides(n) {
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");
  if (!slides.length) return;

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  Array.from(slides).forEach((slide, index) => {
    slide.classList.toggle("show", index === slideIndex - 1);
    // Pause any non-active video to save resources
    if (slide.tagName === "VIDEO" && index !== slideIndex - 1) {
      try { slide.pause(); } catch (e) {}
    }
  });

  Array.from(dots).forEach((dot, i) => {
    dot.classList.toggle("active", i === slideIndex - 1);
  });

  // Update hero overlay text to match current slide
  updateHeroOverlay(localStorage.getItem('currentLang') || 'en');

  clearTimeout(slideTimer);
  handleMediaContent(slides[slideIndex - 1]);
}

function updateHeroOverlay(lang) {
  const metaEl = document.getElementById('heroMeta');
  if (!metaEl) return;
  const d = langData[lang];
  if (!d || !d.heroSlides) return;
  const idx = Math.max(0, Math.min(d.heroSlides.length - 1, slideIndex - 1));
  const s = d.heroSlides[idx];

  // Fade-out / fade-in transition
  metaEl.style.opacity = 0;
  setTimeout(() => {
    metaEl.textContent = s.meta;
    metaEl.style.opacity = 1;
  }, 200);
}

function handleMediaContent(currentSlide) {
  if (!currentSlide) return;
  if (currentSlide.tagName === "VIDEO") {
    if (currentSlide.paused || currentSlide.ended) {
      const playPromise = currentSlide.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(e => console.log("Video play blocked:", e));
      }
    }
    currentSlide.onended = () => { plusSlides(1); };
  } else if (currentSlide.tagName === "IMG") {
    slideTimer = setTimeout(() => { plusSlides(1); }, 5500);
  }
}

/* ---------- Mobile nav ---------- */
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.classList.toggle('show');
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', function() {
  const storedLang = localStorage.getItem('currentLang') || 'en';
  switchLanguage(storedLang, null);

  // Start slideshow if hero exists on this page
  if (document.getElementsByClassName('slide').length > 0) {
    showSlides(slideIndex);
  }
});
