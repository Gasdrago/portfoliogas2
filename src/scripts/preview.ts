import { finePointer, reducedMotion } from './motion';

/**
 * Aperçu flottant pour les listes de projets : l'image du projet survolé
 * suit le pointeur. Uniquement sur pointeur fin ; purement décoratif.
 */
export function initHoverPreview(): void {
  if (!finePointer()) return;

  document.querySelectorAll<HTMLElement>('[data-preview-list]').forEach((list) => {
    const float = list.querySelector<HTMLElement>('[data-preview-float]');
    if (!float) return;
    const frames = Array.from(float.querySelectorAll<HTMLElement>('[data-preview-frame]'));
    const smooth = !reducedMotion();
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    let visible = false;

    const loop = () => {
      const k = smooth ? 0.14 : 1;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      const tilt = smooth ? Math.max(-6, Math.min(6, (target.x - pos.x) * 0.06)) : 0;
      float.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${tilt}deg)`;
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    list.addEventListener('pointermove', (event) => {
      const rect = list.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      const row = (event.target as Element).closest<HTMLElement>('[data-preview]');
      const key = row?.dataset.preview;
      const next = Boolean(key);
      if (next && !visible) {
        pos.x = target.x;
        pos.y = target.y;
      }
      visible = next;
      float.classList.toggle('is-visible', visible);
      frames.forEach((f) => f.classList.toggle('is-current', f.dataset.previewFrame === key));
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });

    list.addEventListener('pointerleave', () => {
      visible = false;
      float.classList.remove('is-visible');
    });
  });
}
