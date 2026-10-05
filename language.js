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
    'navMisc':         "Misc",
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
    'researchLead':    "We work at the intersection of 3D vision, computational photography, and applied AI — building systems that see, measure, and understand the physical world.",
    'researchCaption': "Research areas — overview diagram",
    // Publications page
    'pubEmptyTitle':   "TBD",
    // Misc page
    'miscLabel':       "Videos",
    'miscLead':        "Short videos about life and research in the lab."
  },
  'ja': {
    'brandName':       "コンピュータビジョン研究室",
    'brandSub':        "<国立>奈良女子大学",
    'navOverview':     "概要",
    'navMembers':      "メンバー",
    'navResearch':     "研究",
    'navPublications': "業績",
    'navMisc':         "その他",
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
    'researchLead':    "3Dビジョン、コンピュテーショナルフォトグラフィ、応用AIの境界領域で、物理世界を「見て・再構成・理解する」システムを構築しています。",
    'researchCaption': "研究領域 — 概要図",
    'pubEmptyTitle':   "TBD",
    'miscLabel':       "動画",
    'miscLead':        "研究室の活動や研究を短い動画で紹介します。"
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
  setText('navMisc',         d.navMisc);

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

  // Misc page
  setText('miscLabel',   d.miscLabel);
  setText('miscLead',    d.miscLead);

  // Any element with data-en / data-ja carries its own translations
  // (used for video captions so new videos need no edits here)
  document.querySelectorAll('[data-en]').forEach(el => {
    const t = el.dataset[lang] || el.dataset.en;
    if (t) el.textContent = t;
  });

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

/* ---------- Google Drive video embeds ----------
   Turns a normal Drive share link (…/file/d/ID/view?usp=sharing)
   into the embeddable player URL (…/file/d/ID/preview).        */
function driveToEmbed(url) {
  const m = url.match(/\/file\/d\/([^/?#]+)/) || url.match(/[?&]id=([^&#]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

function initDriveEmbeds() {
  document.querySelectorAll('iframe[data-drive-url]').forEach(f => {
    f.src = driveToEmbed(f.dataset.driveUrl);
  });
}

/* ---------- Misc page videos: one plays at a time ----------
   - The video that is mostly on screen plays (muted, looping).
   - Scrolling away pauses it.
   - Pressing play on another video pauses the current one.
   - A video the visitor paused stays paused.
   - No autoplay for visitors who prefer reduced motion.        */
function initReels() {
  const vids = Array.from(document.querySelectorAll('video.reel-video'));
  if (!vids.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visible = new Map();   // video -> fraction on screen
  let chosen = null;           // last video that played

  const pauseQuietly = v => { v._autoPause = true; v.pause(); };

  vids.forEach(v => {
    v.addEventListener('play', () => {
      chosen = v;
      v._userPaused = false;
      vids.forEach(o => { if (o !== v && !o.paused) pauseQuietly(o); });
    });
    v.addEventListener('pause', () => {
      if (v._autoPause) { v._autoPause = false; return; }
      if (!v.ended) v._userPaused = true;   // visitor pressed pause
    });
  });

  function update() {
    if (reduceMotion) return;
    const onScreen = v => (visible.get(v) || 0) >= 0.6;

    // Keep the current one if it's still on screen, else pick the most visible
    let target = (chosen && onScreen(chosen)) ? chosen : null;
    if (!target) {
      let best = 0.6;
      vids.forEach(v => {
        const r = visible.get(v) || 0;
        if (r >= best && !v._userPaused) { target = v; best = r; }
      });
    }

    vids.forEach(v => { if (v !== target && !v.paused) pauseQuietly(v); });
    if (target && target.paused && !target._userPaused) {
      const p = target.play();
      if (p && p.catch) p.catch(() => {});
    }
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => visible.set(e.target, e.intersectionRatio));
    update();
  }, { threshold: [0, 0.3, 0.6, 0.8, 1] });

  vids.forEach(v => io.observe(v));
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
  initDriveEmbeds();
  initReels();

  // Start slideshow if hero exists on this page
  if (document.getElementsByClassName('slide').length > 0) {
    showSlides(slideIndex);
  }
});
