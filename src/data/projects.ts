import type { ImageMetadata } from 'astro';
import mobotixPortrait from '@/assets/crops/mobotix-app-portrait.jpg';

/**
 * Projets — contenu extrait des planches de présentation originales
 * (src/assets/projects/*) et du CV. Aucun résultat ni chiffre n'est inventé :
 * les champs optionnels (`team`, `role`, `outcome`…) restent vides tant que
 * l'information n'est pas fournie, et les composants ne les affichent pas.
 */

export type ProjectTheme = 'renault' | 'mobotix' | 'inrae';

export interface Project {
  slug: string;
  index: string;
  client: string;
  title: string;
  /** Problématique de départ, telle que formulée dans le dossier. */
  question: string;
  year: string;
  discipline: string;
  /** Phrase courte pour les aperçus. */
  summary: string;
  /** Missions, reprises du CV. */
  tasks: string[];
  theme: ProjectTheme;
  cover: ImageMetadata;
  coverAlt: string;
  /** Visuel secondaire pour le héros / les aperçus. */
  thumb: ImageMetadata;
  thumbAlt: string;
  deck: ImageMetadata[];
  /** À compléter : composition de l'équipe, rôle précis, durée, résultats. */
  team?: string;
  role?: string;
  duration?: string;
  outcome?: string;
  /** Prototype en ligne, présenté après le contenu de l'étude de cas. */
  prototype?: { href: string; label: string };
}

type Glob = Record<string, { default: ImageMetadata }>;

const sortDeck = (glob: Glob) =>
  Object.keys(glob)
    .sort()
    .map((key) => glob[key].default);

const renaultDeck = sortDeck(
  import.meta.glob<{ default: ImageMetadata }>('../assets/projects/renault/*.png', { eager: true }),
);
const mobotixDeck = sortDeck(
  import.meta.glob<{ default: ImageMetadata }>('../assets/projects/mobotix/*.png', { eager: true }),
);
const inraeDeck = sortDeck(
  import.meta.glob<{ default: ImageMetadata }>('../assets/projects/inrae/*.png', { eager: true }),
);

/** Accès 1-indexé à une planche, pour rester aligné sur la numérotation des dossiers. */
export const slide = (deck: ImageMetadata[], n: number): ImageMetadata => {
  const image = deck[n - 1];
  if (!image) throw new Error(`Planche ${n} introuvable`);
  return image;
};

export const decks = { renault: renaultDeck, mobotix: mobotixDeck, inrae: inraeDeck };

export const projects: Project[] = [
  {
    slug: 'renault-center-view',
    index: '01',
    client: 'Renault',
    title: 'Center View',
    question: 'Comment créer le futur de l’interaction de la mobilité ?',
    year: '2024',
    discipline: 'Design d’innovation',
    summary:
      'Repenser le poste de conduite : un tableau de bord épuré autour de trois usages, un volant réinventé et un affichage tête haute.',
    tasks: [
      'Définir l’interaction et analyser le tableau de bord automobile',
      'Identifier les problèmes utilisateurs et formuler une problématique',
      'Élaborer un nouveau tableau de bord plus intuitif, simple et sécurisé',
      'Concevoir un nouveau volant et des boutons adaptés',
    ],
    theme: 'renault',
    cover: slide(renaultDeck, 12),
    coverAlt:
      'Rendu du tableau de bord Center View : un bandeau d’écran épuré qui n’affiche que trois applications — musique, téléphone et navigation.',
    thumb: slide(renaultDeck, 28),
    thumbAlt:
      'Affichage tête haute sur le pare-brise : vitesse, limitation, guidage et météo superposés à la route.',
    deck: renaultDeck,
  },
  {
    slug: 'inrae',
    index: '02',
    client: 'INRAE',
    title: 'Technologies à portée de main',
    question:
      'Comment accompagner les agriculteurs dans leur prise de décision d’adopter une technologie numérique ?',
    year: '2025',
    discipline: 'UX/UI design',
    summary:
      'Du terrain à la maquette : une plateforme qui aide les agriculteurs à comprendre, comparer et choisir une technologie agricole.',
    tasks: [
      'Analyse de terrain et entretiens',
      'Identifier les besoins des agriculteurs',
      'Repenser l’interface d’un site web',
      'Concevoir une maquette de site',
    ],
    theme: 'inrae',
    cover: slide(inraeDeck, 26),
    coverAlt:
      'Page d’accueil de la maquette : « Bienvenue sur INRAE » en grand sur une photographie aérienne de rangs de cultures.',
    thumb: slide(inraeDeck, 30),
    thumbAlt: 'Écran « Produit pour vous » de la maquette, sur une photographie de serre.',
    deck: inraeDeck,
  },
  {
    slug: 'mobotix-sun-scan',
    index: '03',
    client: 'Mobotix',
    title: 'Sun Scan',
    question: 'Comment faire de la caméra un outil pour l’utilisateur ?',
    year: '2023',
    discipline: 'Design produit',
    summary:
      'Faire passer la caméra de la surveillance à la bienveillance : un habillage en bouée de sauvetage et une application pour les maîtres-nageurs.',
    tasks: [
      'Définir les objectifs du projet et élaborer une stratégie',
      'Tester le POC (Proof of Concept)',
      'Designer une application mobile « Sun Scan »',
      'Concevoir un habillage de caméra',
    ],
    theme: 'mobotix',
    cover: slide(mobotixDeck, 20),
    coverAlt:
      'Maquettes de l’application Sun Scan : écran d’accueil, alerte de sortie de zone, niveau de risque et statistiques de fréquentation.',
    thumb: mobotixPortrait,
    thumbAlt:
      'Écrans superposés de l’application Sun Scan : démarrage, alerte « sortie de zone », niveau de risque et statistiques.',
    deck: mobotixDeck,
  },
];

/**
 * Autres projets mentionnés au CV ou fournis sans dossier d'images.
 * `href` optionnel : lien externe vers un prototype en ligne.
 */
export interface OtherProject {
  name: string;
  discipline: string;
  year?: string;
  note: string;
  href?: string;
}

export const otherProjects: OtherProject[] = [
  {
    // À compléter : contexte, année et description du projet IDF.
    name: 'IDF',
    discipline: 'Prototype interactif',
    note: 'Prototype en ligne',
    href: 'https://empathic-learning-grove.lovable.app/',
  },
];

export const getProject = (slug: string): Project => {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Projet inconnu : ${slug}`);
  return project;
};

export const getNextProject = (slug: string): Project => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
