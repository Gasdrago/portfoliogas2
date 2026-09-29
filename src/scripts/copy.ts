/** Bouton « Copier l'adresse » avec retour d'état annoncé aux lecteurs d'écran. */
export function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    if (!label || !navigator.clipboard) {
      button.hidden = true;
      return;
    }
    const initial = label.textContent ?? '';
    button.setAttribute('aria-live', 'polite');

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '');
        label.textContent = 'Adresse copiée ✓';
        button.classList.add('is-done');
      } catch {
        label.textContent = 'Copie impossible';
      }
      window.setTimeout(() => {
        label.textContent = initial;
        button.classList.remove('is-done');
      }, 2200);
    });
  });
}
