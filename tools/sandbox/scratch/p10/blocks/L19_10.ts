type Crumb = { t: number; type: 'nav' | 'click' | 'fetch-fail'; detail: string };
const crumbs: Crumb[] = [];
const push = (c: Omit<Crumb, 't'>) => { crumbs.push({ t: Date.now(), ...c }); if (crumbs.length > 20) crumbs.shift(); };

export function getBreadcrumbs(): readonly Crumb[] { return crumbs.slice(); }

export function installBreadcrumbs() {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest?.('[data-track]');
    if (el) push({ type: 'click', detail: el.getAttribute('data-track') ?? '' });
  }, { capture: true });

  window.addEventListener('popstate', () => push({ type: 'nav', detail: location.pathname }));

  const orig = window.fetch;
  window.fetch = async (...args) => {
    try {
      const res = await orig(...args);
      if (!res.ok) push({ type: 'fetch-fail', detail: `${res.status} ${String(args[0]).split('?')[0]}` });
      return res;
    } catch (err) {
      push({ type: 'fetch-fail', detail: `network ${String(args[0]).split('?')[0]}` });
      throw err;
    }
  };
}
