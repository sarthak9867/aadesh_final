// -----------------------------
// Language Picker Script
// -----------------------------
// Set true to allow selecting multiple languages; false for single-select
const MULTI_SELECT = false;

// List of languages (name and code). You can expand this.
const LANGUAGES = [
  {name: "English", code: "en"},
  {name: "Spanish", code: "es"},
  {name: "French", code: "fr"},
  {name: "German", code: "de"},
  {name: "Chinese (Simplified)", code: "zh-CN"},
  {name: "Chinese (Traditional)", code: "zh-TW"},
  {name: "Arabic", code: "ar"},
  {name: "Hindi", code: "hi"},
  {name: "Portuguese", code: "pt"},
  {name: "Russian", code: "ru"},
  {name: "Japanese", code: "ja"},
  {name: "Korean", code: "ko"},
  {name: "Italian", code: "it"},
  {name: "Turkish", code: "tr"},
  {name: "Dutch", code: "nl"},
  {name: "Polish", code: "pl"},
  {name: "Indonesian", code: "id"},
  {name: "Vietnamese", code: "vi"},
  {name: "Thai", code: "th"},
  {name: "Swedish", code: "sv"},
  {name: "Danish", code: "da"},
  {name: "Finnish", code: "fi"},
  {name: "Greek", code: "el"},
  {name: "Hebrew", code: "he"},
  {name: "Malay", code: "ms"},
  {name: "Bengali", code: "bn"}
];

// DOM refs
const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');
const langList = document.getElementById('langList');
const langSearch = document.getElementById('langSearch');
const langSelected = document.getElementById('langSelected');
const selectedCount = document.getElementById('selectedCount');
const toggleMulti = document.getElementById('toggleMulti');
const applyBtn = document.getElementById('applyBtn');
const clearSearch = document.getElementById('clearSearch');

// Track selection
let selected = new Set();
if (!MULTI_SELECT) toggleMulti.checked = false;

// Populate list
function buildList(filter = '') {
  langList.innerHTML = '';
  const f = filter.trim().toLowerCase();
  LANGUAGES.forEach(lang => {
    if (f && !(lang.name.toLowerCase().includes(f) || lang.code.toLowerCase().includes(f))) {
      return;
    }
    const li = document.createElement('li');
    li.className = 'lang-item';
    li.setAttribute('data-code', lang.code);
    li.setAttribute('role', 'option');
    li.innerHTML = `<div class="left"><strong>${lang.name}</strong><div class="code">${lang.code}</div></div>
                    <div class="right">${selected.has(lang.code) ? '✓' : ''}</div>`;
    li.addEventListener('click', () => toggleSelect(lang.code, lang.name));
    langList.appendChild(li);
  });
  updateSelectedUI();
}

// Toggle selection (single or multi)
function toggleSelect(code, name) {
  if (toggleMulti.checked || MULTI_SELECT) {
    if (selected.has(code)) selected.delete(code);
    else selected.add(code);
  } else {
    // single-select: replace
    selected.clear();
    selected.add(code);
    // Immediately apply for single-select
    applySelection();
  }
  updateSelectedUI();
}

// Update UI (mark selected items and counter)
function updateSelectedUI() {
  // mark items in the list
  document.querySelectorAll('.lang-item').forEach(li => {
    const code = li.getAttribute('data-code');
    if (selected.has(code)) li.classList.add('selected');
    else li.classList.remove('selected');
    const right = li.querySelector('.right');
    if (right) right.textContent = selected.has(code) ? '✓' : '';
  });
  selectedCount.textContent = selected.size;
  // update button text (if single selection only show the name)
  if (selected.size === 1) {
    const code = Array.from(selected)[0];
    const entry = LANGUAGES.find(l => l.code === code);
    langSelected.textContent = entry ? entry.name : langSelected.textContent;
  } else if (selected.size > 1) {
    langSelected.textContent = `${selected.size} selected`;
  } else {
    // default
    langSelected.textContent = 'English';
  }
}

// Apply selection (called when user presses Apply or single-select)
function applySelection() {
  if (selected.size === 0) {
    langSelected.textContent = 'English';
  } else if (selected.size === 1) {
    const code = Array.from(selected)[0];
    const entry = LANGUAGES.find(l => l.code === code);
    langSelected.textContent = entry ? entry.name : `${code}`;
  } else {
    langSelected.textContent = `${selected.size} selected`;
  }
  closeDropdown();
  // TODO: Integrate actual language switching logic here.
  // e.g., send selection to server, set cookie, load translations, etc.
}

// Open / Close dropdown
function openDropdown() {
  langDropdown.classList.add('open');
  langBtn.setAttribute('aria-expanded','true');
  langSearch.focus();
}
function closeDropdown() {
  langDropdown.classList.remove('open');
  langBtn.setAttribute('aria-expanded','false');
  langSearch.value = '';
  buildList();
}

// Event listeners
langBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (langDropdown.classList.contains('open')) closeDropdown();
  else openDropdown();
});

// Click outside closes
document.addEventListener('click', (e) => {
  if (!document.getElementById('langWrap').contains(e.target)) {
    closeDropdown();
  }
});

// Search filter
langSearch.addEventListener('input', (e) => {
  buildList(e.target.value);
});
clearSearch.addEventListener('click', () => { langSearch.value=''; buildList(); langSearch.focus(); });

// Apply button
applyBtn.addEventListener('click', () => {
  applySelection();
});

// Toggle multi checkbox updates aria
toggleMulti.addEventListener('change', () => {
  const multi = toggleMulti.checked || MULTI_SELECT;
  langList.setAttribute('aria-multiselectable', multi ? 'true' : 'false');
  if (!multi && selected.size > 1) {
    // if switching to single-select, keep the most-recently selected (last in set)
    const last = Array.from(selected).pop();
    selected.clear();
    if (last) selected.add(last);
    updateSelectedUI();
    applySelection();
  }
});

// keyboard: ESC closes
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDropdown();
});

// init
buildList();
updateSelectedUI();
// ===== Hero interactivity & image reveal =====
(function() {
  // CTA buttons
  const exploreBtn = document.getElementById('exploreBtn');
  const contactBtn = document.getElementById('contactBtn');
  exploreBtn && exploreBtn.addEventListener('click', (e) => {
    // default anchor will scroll; if you want smooth scroll:
    e.preventDefault();
    const target = document.querySelector('#products');
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });

  contactBtn && contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    else {
      // fallback: open mailto (update email as needed)
      window.location.href = 'mailto:info@example.com';
    }
  });

  // IntersectionObserver to reveal hero image when visible
  const heroImg = document.getElementById('heroImage');
  if (heroImg && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroImg.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.2});
    io.observe(heroImg);
  } else if (heroImg) {
    // fallback
    heroImg.classList.add('in-view');
  }
})();
// ===== ACCORDION INTERACTION =====
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    const isOpen = item.classList.contains("active");

    // close all
    document.querySelectorAll(".accordion-item").forEach((i) =>
      i.classList.remove("active")
    );

    // toggle current
    if (!isOpen) item.classList.add("active");
  });
});
// ===== Header sticky spacer (dynamic) =====
// Calculates header height and sets CSS variable and body padding so
// content is never hidden under the fixed header. Runs on load & resize.
(function(){
  function updateHeaderSpacing(){
    const header = document.querySelector('.site-header');
    if (!header) return;
    // get computed height including borders
    const rect = header.getBoundingClientRect();
    const h = Math.ceil(rect.height);
    // set CSS variable on :root
    document.documentElement.style.setProperty('--site-header-height', h + 'px');
    // ensure body padding is in sync (in case CSS variable isn't used)
    document.body.style.paddingTop = h + 'px';
  }

  // Run on load
  window.addEventListener('load', updateHeaderSpacing);
  // Run on resize and orientation change
  window.addEventListener('resize', updateHeaderSpacing);
  window.addEventListener('orientationchange', updateHeaderSpacing);

  // Also watch for DOM changes that could change header size (rare)
  const headerEl = document.querySelector('.site-header');
  if (headerEl && 'MutationObserver' in window) {
    const mo = new MutationObserver(updateHeaderSpacing);
    mo.observe(headerEl, {childList:true, subtree:true, attributes:true, characterData:true});
  }
})();
/* ===== About section reveal (append) ===== */
(function(){
  const about = document.querySelector('.about-section');
  if(!about) return;
  about.setAttribute('data-visible','false');

  // IntersectionObserver to reveal section on scroll
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if(en.isIntersecting){
          about.setAttribute('data-visible','true');
          obs.unobserve(en.target);
        }
      });
    }, {root: null, threshold: 0.15});
    io.observe(about);
  } else {
    // fallback: reveal immediately
    about.setAttribute('data-visible','true');
  }

  // optional: smooth-scroll for CTA buttons that link to #contact (if not already present)
  document.querySelectorAll('.about-actions a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({top, behavior:'smooth'});
      }
    });
  });
})();
// ===== Footer helpers: dynamic year + back-to-top =====
(function(){
  // set current year
  const fy = document.getElementById('footerYear');
  if(fy) fy.textContent = new Date().getFullYear();

  // back-to-top button behavior
  const backBtn = document.getElementById('backToTopBtn');
  const backLink = document.getElementById('footerBackToTop');

  function checkScroll() {
    if(window.scrollY > 320) backBtn.style.display = 'block';
    else backBtn.style.display = 'none';
  }
  window.addEventListener('scroll', checkScroll);
  checkScroll();

  function scrollTop(e){
    if(e) e.preventDefault();
    window.scrollTo({top:0, behavior:'smooth'});
  }
  if(backBtn) backBtn.addEventListener('click', scrollTop);
  if(backLink) backLink.addEventListener('click', scrollTop);
})();



