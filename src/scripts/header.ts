/**
 * En-tête : fond au scroll, masquage en descente, ton clair/sombre selon la
 * surface située dessous ([data-surface="dark"]), et menu mobile accessible.
 */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const probeY = () => header.offsetHeight / 2;

  const updateTone = () => {
    const x = Math.round(window.innerWidth / 2);
    const stack = document.elementsFromPoint(x, probeY());
    const below = stack.find((el) => !header.contains(el));
    const dark = below?.closest('[data-surface]')?.getAttribute('data-surface') === 'dark';
    header.dataset.tone = dark ? 'dark' : 'light';
  };

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const goingDown = y > lastY && y > window.innerHeight * 0.4;
    if (Math.abs(y - lastY) > 6) header.classList.toggle('is-hidden', goingDown);
    lastY = y;
    updateTone();
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', updateTone, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  update();

  initMenu(header);
}

function initMenu(header: HTMLElement): void {
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = header.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;

  const label = toggle.querySelector<HTMLElement>('.menu-toggle__label');
  const outside = [document.querySelector('main'), document.querySelector('footer')].filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? label.dataset.labelOpen ?? '' : label.dataset.labelClosed ?? '';
    header.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    outside.forEach((el) => (el.inert = open));

    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => {
        menu.classList.add('is-open');
        menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
      });
    } else {
      menu.classList.remove('is-open');
      const hide = () => {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      };
      menu.addEventListener('transitionend', hide, { once: true });
      window.setTimeout(hide, 800);
    }
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  menu.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 768px)').addEventListener('change', (mq) => {
    if (mq.matches) setOpen(false);
  });
}
