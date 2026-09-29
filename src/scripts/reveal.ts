/**
 * Ajoute `.is-in` aux éléments [data-reveal] et [data-lines] à leur entrée
 * dans le viewport. Le CSS ne masque ces éléments que si `.js` est présent
 * et si prefers-reduced-motion n'est pas activé.
 */
export function initReveal(): void {
  // Les titres [data-lines="load"] s'animent en CSS dès le chargement.
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="load"]), [data-lines]:not([data-lines="load"])');
  if (!targets.length) return;

  // Numérote les lignes des titres pour le décalage (stagger).
  document.querySelectorAll<HTMLElement>('[data-lines]:not([data-lines="load"])').forEach((title) => {
    title.querySelectorAll<HTMLElement>(':scope > .line > span').forEach((span, i) => {
      span.style.setProperty('--l', String(i));
    });
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => observer.observe(el));
}
