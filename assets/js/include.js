// Fetch and inject partials: <div data-include="partials/header-*.html"></div>
document.addEventListener('DOMContentLoaded', async () => {
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all([...nodes].map(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      el.innerHTML = await res.text();
    } catch (e) {
      console.error('include.js: failed to include', url, e);
      el.innerHTML = `
        <!-- include failed: ${url} -->
        <div style="display:none" aria-live="polite">Section failed to load.</div>`;
    }
  }));
  document.dispatchEvent(new Event('includes:loaded'));
});
