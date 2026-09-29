import { finePointer, reducedMotion } from './motion';

/**
 * Étiquette qui suit le pointeur au-dessus des éléments [data-cursor="Libellé"].
 * Interpolation légère (lerp) pour une sensation de fluidité, désactivée
 * si l'utilisateur préfère moins de mouvement.
 */
export function initCursor(): void {
  const el = document.querySelector<HTMLElement>('[data-cursor-el]');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!el || !label || !finePointer()) return;

  const smooth = !reducedMotion();
  const target = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  let raf = 0;
  let active = false;

  const render = () => {
    const k = smooth ? 0.22 : 1;
    pos.x += (target.x - pos.x) * k;
    pos.y += (target.y - pos.y) * k;
    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    const settled = Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1;
    raf = settled && !active ? 0 : requestAnimationFrame(render);
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      target.x = event.clientX;
      target.y = event.clientY;
      const host = (event.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      const next = Boolean(host);
      if (next && host) label.textContent = host.dataset.cursor || 'Voir';
      if (next && !active) {
        // Évite l'effet de glissement depuis l'ancienne position.
        pos.x = target.x;
        pos.y = target.y;
      }
      active = next;
      el.classList.toggle('is-active', active);
      kick();
    },
    { passive: true },
  );

  document.addEventListener('pointerleave', () => {
    active = false;
    el.classList.remove('is-active');
  });
}
