/**
 * Visionneuse plein écran basée sur <dialog> (focus piégé et Échap natifs).
 * Déclencheurs : <button data-lightbox="groupe" data-src data-srcset data-alt data-caption>.
 * Navigation clavier (← →), boutons, et glissé tactile.
 */
export function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-lightbox]'));
  if (!dialog || !triggers.length) return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lb-caption]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-lb-counter]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lb-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-lb-close]')!;

  let group: HTMLElement[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;

  const render = () => {
    const item = group[index];
    if (!item) return;
    img.classList.remove('is-loaded');
    img.onload = () => img.classList.add('is-loaded');
    img.srcset = item.dataset.srcset ?? '';
    img.src = item.dataset.src ?? '';
    img.alt = item.dataset.alt ?? '';
    caption.textContent = item.dataset.caption ?? '';
    caption.hidden = !item.dataset.caption;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(group.length).padStart(2, '0')}`;
    const single = group.length < 2;
    prev.hidden = single;
    next.hidden = single;
    // Précharge la suivante.
    const upcoming = group[(index + 1) % group.length];
    if (upcoming?.dataset.src) {
      const pre = new Image();
      pre.srcset = upcoming.dataset.srcset ?? '';
      pre.src = upcoming.dataset.src;
    }
  };

  const go = (step: number) => {
    index = (index + step + group.length) % group.length;
    render();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      group = triggers.filter((t) => t.dataset.lightbox === trigger.dataset.lightbox);
      index = group.indexOf(trigger);
      opener = trigger;
      render();
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
  });

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  close.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') go(1);
    if (event.key === 'ArrowLeft') go(-1);
  });

  // Clic sur le fond (hors image et contrôles) : fermeture.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || (event.target as HTMLElement).hasAttribute('data-lb-stage')) dialog.close();
  });

  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    img.removeAttribute('src');
    img.removeAttribute('srcset');
    opener?.focus({ preventScroll: true });
  });

  // Glissé tactile
  let startX = 0;
  dialog.addEventListener('pointerdown', (e) => (startX = e.clientX), { passive: true });
  dialog.addEventListener(
    'pointerup',
    (e) => {
      if (e.pointerType === 'mouse') return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );
}
