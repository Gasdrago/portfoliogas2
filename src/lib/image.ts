import type { ImageMetadata } from 'astro';

/**
 * Lit les dimensions d'une image importée sans la marquer comme « référencée ».
 * En build, Astro copie l'original dans dist/ dès qu'une propriété de l'objet
 * est lue directement ; passer par `clone` évite d'embarquer des fichiers de
 * plusieurs Mo qui ne sont jamais servis (seules les variantes WebP le sont).
 */
export function dims(image: ImageMetadata): { width: number; height: number } {
  const meta = (image as ImageMetadata & { clone?: ImageMetadata }).clone ?? image;
  return { width: meta.width, height: meta.height };
}

/** Largeurs de srcset plafonnées à la largeur native de l'image. */
export function widthsFor(image: ImageMetadata, candidates: number[]): number[] {
  const { width } = dims(image);
  const list = candidates.filter((w) => w <= width);
  return list.length ? list : [width];
}

export const isPortrait = (image: ImageMetadata): boolean => {
  const { width, height } = dims(image);
  return height > width;
};
