import { reducedMotion } from './motion';

/**
 * Vidéos d'ambiance [data-ambient] : chargées et lues uniquement lorsqu'elles
 * sont visibles, mises en pause hors champ, jamais lues si l'utilisateur
 * préfère moins de mouvement (l'image fixe reste affichée).
 */
export function initAmbientVideo(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-ambient]');
  if (!videos.length || reducedMotion() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          if (video.preload === 'none') {
            video.preload = 'auto';
            video.load();
          }
          video
            .play()
            .then(() => video.classList.add('is-playing'))
            .catch(() => undefined);
        } else {
          video.pause();
        }
      }
    },
    { threshold: 0.15 },
  );

  videos.forEach((video) => observer.observe(video));
}
