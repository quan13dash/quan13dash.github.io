(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Apply saved theme (if any). If none, respect system preference by leaving no data-theme.
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  // Gradient presets (light / dark variants)
  const gradients = [
    { light: ['#ffecd2', '#fcb69f'], dark: ['#0b1220', '#07203a'] },
    { light: ['#a1c4fd', '#c2e9fb'], dark: ['#0f2027', '#203a43'] },
    { light: ['#fddb92', '#d1fdff'], dark: ['#141e30', '#243b55'] },
    { light: ['#f6d365', '#fda085'], dark: ['#052e16', '#14532d'] },
    { light: ['#96fbc4', '#f9f586'], dark: ['#022c22', '#34d399'] },
    { light: ['#fbc2eb', '#a6c1ee'], dark: ['#0f0c29', '#302b63'] },
    { light: ['#c2e9fb', '#a1c4fd'], dark: ['#111827', '#065f46'] },
    { light: ['#ffafbd', '#ffc3a0'], dark: ['#1f2937', '#0f766e'] },
    { light: ['#d4fc79', '#96e6a1'], dark: ['#052e16', '#166534'] },
    { light: ['#ffffff', '#ffd3b6'], dark: ['#110c11', '#2e1c2b'] },
    { light: ['#d4fc79', '#96e6a1'], dark: ['#000000', '#0a2f35'] },
    { light: ['#a8e6cf', '#71c99f'], dark: ['#051c12', '#0d3826'] },
  ];

  let currentGradient = Math.floor(Math.random() * gradients.length);
  let gradientTimer = null;

  function applyGradient(idx) {
    const theme = root.getAttribute('data-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = (theme === 'dark') || (!theme && prefersDark);
    const pair = gradients[idx % gradients.length];
    const colors = useDark ? pair.dark : pair.light;
    root.style.setProperty('--bg-1', colors[0]);
    root.style.setProperty('--bg-2', colors[1]);
    // also set animated overlay colors (slightly adjusted alpha-friendly vars)
    root.style.setProperty('--g1', colors[0]);
    root.style.setProperty('--g2', colors[1]);
  }

  function startGradientCycle(interval = 5000){
    if (gradientTimer) clearInterval(gradientTimer);
    gradientTimer = setInterval(()=>{
      currentGradient = (currentGradient + 1) % gradients.length;
      applyGradient(currentGradient);
    }, interval);
  }

  // Initialize gradient on load
  applyGradient(currentGradient);
  startGradientCycle();

  function toggleTheme() {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    // update gradient immediately to match explicit theme
    applyGradient(currentGradient);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  if (navToggle && navLinks) navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Fill current year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(y);

  // Listen for system changes if user hasn't set an explicit preference
  if (!saved && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener && mq.addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        // when system preference changes and no saved preference, refresh gradient
        applyGradient(currentGradient);
      }
    });
  }
})();

/* Profile history modal behaviour — only initialize on the profile history page */
(function(){
  if(!document.querySelector('.profile-history-page')) return;
  document.addEventListener('DOMContentLoaded',()=>{
    const modal=document.getElementById('pfp-modal');
    const modalImg=document.getElementById('modal-img');
    const modalCaption=document.getElementById('modal-caption');
    const closeBtn=document.getElementById('modal-close');

    // image click-to-open removed: images are now non-clickable; use Details button instead

    // Details button behavior removed — buttons keep styling but are inert until implemented.

    function closeModal(){
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
      modalImg.src='';
    }

    if(closeBtn) closeBtn.addEventListener('click',closeModal);
    if(modal) modal.addEventListener('click',(e)=>{if(e.target===modal)closeModal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

    // details buttons are inert here by design
  });
})();

// Animate profile-history dropdowns smoothly
(function(){
  const dropdowns = document.querySelectorAll('.pfp-group-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach((details) => {
    const inner = details.querySelector('.timeline-inner');
    if (!inner) return;

    const syncHeight = () => {
      if (details.open) {
        inner.style.maxHeight = `${inner.scrollHeight}px`;
        inner.style.opacity = '1';
        inner.style.transform = 'translateY(0)';
      } else {
        inner.style.maxHeight = '0px';
        inner.style.opacity = '0';
        inner.style.transform = 'translateY(-6px)';
      }
    };

    syncHeight();
    details.addEventListener('toggle', syncHeight);
    window.addEventListener('resize', syncHeight);
  });
})();

// Fill download inputs with absolute URLs and wire download buttons
// No global download-input population — per-page links are static. Keep code minimal.
