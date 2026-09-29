import type { ImageMetadata } from 'astro';

import cristal from '@/assets/lab/illustration/cristal.jpeg';
import parfum from '@/assets/lab/illustration/parfum.tiff';
import ange from '@/assets/lab/illustration/ange.png';
import photomontage from '@/assets/lab/illustration/photomontage.png';
import throne from '@/assets/lab/illustration/throne-de-fork.png';

/**
 * Lab — productions personnelles et exercices (typographie, 3D, image).
 * Les légendes décrivent ce qui est visible ; titres et outils à préciser si besoin.
 */

export interface LabItem {
  image: ImageMetadata;
  alt: string;
  caption?: string;
}

export interface LabSeries {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  layout: 'wide' | 'mixed';
  items: LabItem[];
}

type Glob = Record<string, { default: ImageMetadata }>;
const sorted = (glob: Glob) =>
  Object.keys(glob)
    .sort()
    .map((key) => glob[key].default);

const typo = sorted(
  import.meta.glob<{ default: ImageMetadata }>('../assets/lab/typographie/*.png', { eager: true }),
);
const threeD = sorted(
  import.meta.glob<{ default: ImageMetadata }>('../assets/lab/3d/*.jpg', { eager: true }),
);

const monuments = [
  'Pyramides de Gizeh',
  'Chichén Itzá',
  'Machu Picchu',
  'Jardins suspendus de Babylone',
  'Grande Muraille',
  'Taj Mahal',
  'Colisée',
  'Pétra',
  'Statue de Zeus à Olympie',
  'Colosse de Rhodes',
  'Mausolée d’Halicarnasse',
  'Angkor',
  'Stonehenge',
];

export const lab: LabSeries[] = [
  {
    id: 'typographie',
    index: 'A',
    title: 'Typographie',
    kicker: '13 affiches',
    description:
      'Une série d’affiches où le lettrage épouse chaque monument : sa matière, sa géométrie, sa lumière. Un nom, un site, une écriture.',
    layout: 'wide',
    items: typo.map((image, i) => ({
      image,
      alt: `Affiche typographique « ${monuments[i]} » : le nom du monument en lettrage dessiné, posé sur une photographie du site.`,
      caption: monuments[i],
    })),
  },
  {
    id: '3d',
    index: 'B',
    title: '3D',
    kicker: 'Modélisation & rendu',
    description:
      'Modélisation d’un chasseur TIE, de l’objet isolé à la mise en scène : textures, éclairage, cadrage.',
    layout: 'wide',
    items: threeD.map((image, i) => ({
      image,
      alt: [
        'Chasseur TIE modélisé en 3D, vue de trois quarts sur fond noir.',
        'Chasseur TIE vu de face, ailes hexagonales texturées.',
        'Gros plan sur une aile du chasseur TIE.',
        'Trois chasseurs TIE alignés sur un bloc texturé.',
        'Chasseur TIE vu de dessus, survolant une surface mécanique.',
        'Mise en scène : escadrille de chasseurs TIE dans l’espace, au-dessus d’une planète.',
      ][i] ?? `Rendu 3D ${i + 1}`,
    })),
  },
  {
    id: 'image',
    index: 'C',
    title: 'Image',
    kicker: 'Illustration, photo, affiche',
    description:
      'Rendus produit, photographie, affiche et photomontage : des exercices de lumière, de matière et de composition.',
    layout: 'mixed',
    items: [
      {
        image: parfum,
        alt: 'Flacon de parfum bleu et rouge posé sur une surface réfléchissante, dans une lumière bleue.',
        caption: 'Rendu produit',
      },
      {
        image: throne,
        alt: 'Affiche « Le Throne de Fork — Mettez-vous à couvert » : un trône composé de fourchettes, en noir et blanc.',
        caption: 'Affiche',
      },
      {
        image: cristal,
        alt: 'Bloc de cristal gravé de satellites, traversé par des traînées de lumière sur fond noir.',
        caption: 'Photographie',
      },
      {
        image: ange,
        alt: 'Illustration en niveaux de gris d’une figure ailée aux bras écartés.',
        caption: 'Illustration',
      },
      {
        image: photomontage,
        alt: 'Photomontage : une créature dessinée de style manga surgit derrière Gaspard, devant un paysage de source chaude.',
        caption: 'Photomontage',
      },
    ],
  },
];
