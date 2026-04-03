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
    { light: ['#f6d365', '#fda085'], dark: ['#0f2027', '#2c5364'] },
    { light: ['#96fbc4', '#f9f586'], dark: ['#3a1c71', '#d76d77'] },
    { light: ['#fbc2eb', '#a6c1ee'], dark: ['#0f0c29', '#302b63'] }
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

  function startGradientCycle(interval = 8000){
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
