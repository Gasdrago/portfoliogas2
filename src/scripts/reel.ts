import { reducedMotion } from './motion';

/**
 * Bobine du héros : fait défiler les projets phares.
 * WCAG 2.2.2 — un bouton permet de mettre en pause ; pas de défilement
 * automatique si l'utilisateur préfère moins de mouvement.
 */
export function initReel(): void {
  document.querySelectorAll<HTMLElement>('[data-reel]').forEach((reel) => {
    const items = Array.from(reel.querySelectorAll<HTMLElement>('[data-reel-item]'));
    const dots = Array.from(reel.querySelectorAll<HTMLButtonElement>('[data-reel-dot]'));
    const toggle = reel.querySelector<HTMLButtonElement>('[data-reel-toggle]');
    if (items.length < 2) return;

    const interval = Number(reel.dataset.interval) || 4800;
    let current = 0;
    let timer = 0;
    let paused = reducedMotion();
    let hovering = false;

    const show = (index: number) => {
      current = (index + items.length) % items.length;
      items.forEach((item, i) => {
        const on = i === current;
        item.classList.toggle('is-current', on);
        item.setAttribute('aria-hidden', String(!on));
        item.querySelectorAll('a').forEach((a) => (a.tabIndex = on ? 0 : -1));
      });
      dots.forEach((dot, i) => {
        dot.setAttribute('aria-current', String(i === current));
        dot.classList.remove('is-running');
      });
      schedule();
    };

    const schedule = () => {
      window.clearTimeout(timer);
      const running = !paused && !hovering && !document.hidden;
      reel.classList.toggle('is-running', running);
      if (!running) return;
      // Relance l'animation de la jauge de progression.
      const dot = dots[current];
      if (dot) {
        void dot.offsetWidth;
        dot.classList.add('is-running');
      }
      timer = window.setTimeout(() => show(current + 1), interval);
    };

    const setPaused = (value: boolean) => {
      paused = value;
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', paused ? 'Lancer le défilement' : 'Mettre en pause le défilement');
      }
      schedule();
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
    toggle?.addEventListener('click', () => setPaused(!paused));
    reel.addEventListener('pointerenter', () => ((hovering = true), schedule()));
    reel.addEventListener('pointerleave', () => ((hovering = false), schedule()));
    reel.addEventListener('focusin', () => ((hovering = true), schedule()));
    reel.addEventListener('focusout', () => ((hovering = false), schedule()));
    document.addEventListener('visibilitychange', schedule);

    reel.style.setProperty('--reel-interval', `${interval}ms`);
    setPaused(paused);
    show(0);
  });
}
