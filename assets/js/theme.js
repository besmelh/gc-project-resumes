(function () {
  const KEY = 'theme'; // 'light' | 'dark'
  const html = document.documentElement;


  function apply(theme) {
    html.classList.remove('theme-light', 'theme-dark');
    if (theme === 'light') html.classList.add('theme-light');
    else html.classList.add('theme-dark');
  }

  function current() {
    if (html.classList.contains('theme-dark')) return 'dark';
    if (html.classList.contains('theme-light')) return 'light';
    return null;
  }

  function determineInitial() {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncRocker() {
    const rocker = document.getElementById('themeRocker');
    if (!rocker) return;
    const t = current();
    rocker.dataset.side = (t === 'dark') ? 'right' : 'left';
    rocker.querySelectorAll('button[data-theme]').forEach(b => {
      b.setAttribute('aria-selected', String(b.getAttribute('data-theme') === t));
    });
  }

  function wireRocker() {
    const rocker = document.getElementById('themeRocker');
    if (!rocker || rocker.dataset.wired === 'true') return;
    rocker.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      const t = btn.getAttribute('data-theme'); // 'light' | 'dark'
      localStorage.setItem(KEY, t);
      apply(t);
      syncRocker();
    });
    rocker.dataset.wired = 'true';
    syncRocker();
  }

  // Initialize as early as possible
  document.addEventListener('DOMContentLoaded', () => {
    apply(determineInitial());
    wireRocker(); // in case header is inline
  });

  // Re-wire after partials injection (header comes from /partials/*.html)
  document.addEventListener('includes:loaded', () => {
    wireRocker();
  });
})();

/* === Reveal-on-scroll (for .reveal elements) ========================== */
(function () {
  function activateReveals() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything if IO isn't supported
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }

  // run after DOM and also after partials have been injected
  document.addEventListener('DOMContentLoaded', activateReveals);
  document.addEventListener('includes:loaded', activateReveals);
})();
