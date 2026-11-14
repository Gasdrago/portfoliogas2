import type { ImageMetadata } from 'astro';
import mobotixPortrait from '@/assets/crops/mobotix-app-portrait.jpg';
import laposteMascot from '@/assets/crops/laposte-postit.jpg';
import earthCover from '@/assets/crops/earth-evobim.jpg';
import earthBim from '@/assets/crops/earth-bim.jpg';
import idfCover from '@/assets/projects/idf/visuels/cover.jpg';
import idfManette from '@/assets/projects/idf/visuels/manette.jpg';
import renaultCover from '@/assets/projects/renault-copilote/je-vous-ecoute.png';
import renaultCompagnon from '@/assets/crops/renault-compagnon.jpg';

/**
 * Projets — contenu extrait des planches de présentation originales
 * (src/assets/projects/*) et du CV. Aucun résultat ni chiffre n'est inventé :
 * les champs optionnels (`team`, `role`, `outcome`…) restent vides tant que
 * l'information n'est pas fournie, et les composants ne les affichent pas.
 */

export type ProjectTheme = 'renault' | 'mobotix' | 'inrae' | 'laposte' | 'earth' | 'idf';

export interface Project {
  slug: string;
  index: string;
  client: string;
  title: string;
  /** Problématique de départ, telle que formulée dans le dossier. */
  question: string;
  /** Année, si elle figure dans le CV ou le dossier. */
  year?: string;
  discipline: string;
  /** Phrase courte pour les aperçus. */
  summary: string;
  /** Missions, reprises du CV (vide si le projet n'y figure pas). */
  tasks: string[];
  /** Cadre du projet, affiché dans l'en-tête de l'étude de cas. */
  context?: string;
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
  /** Affiche le bouton du prototype en haut de la fiche plutôt qu'après le contenu. */
  prototypeTop?: boolean;
  /** Légende de l'image d'ouverture : ce qu'il faut y remarquer. */
  coverCaption?: string;
  /** Sélection du portfolio à laquelle le projet est rattaché. */
  selection?: 'Conseil et innovation' | 'Ingénierie';
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
const renaultCopiloteSlides = sortDeck(
  import.meta.glob<{ default: ImageMetadata }>('../assets/projects/renault/slides-copilote/*.png', { eager: true }),
);
const laposteDeck = sortDeck(
  import.meta.glob<{ default: ImageMetadata }>('../assets/projects/la-poste/*.png', { eager: true }),
);
const idfDeck = sortDeck(
  import.meta.glob<{ default: ImageMetadata }>('../assets/projects/idf/planches/*.jpg', { eager: true }),
);
const earthDeck = sortDeck(
  import.meta.glob<{ default: ImageMetadata }>('../assets/projects/earth-to-earth/*.png', { eager: true }),
);

/** Accès 1-indexé à une planche, pour rester aligné sur la numérotation des dossiers. */
export const slide = (deck: ImageMetadata[], n: number): ImageMetadata => {
  const image = deck[n - 1];
  if (!image) throw new Error(`Planche ${n} introuvable`);
  return image;
};

export const decks = {
  renault: renaultDeck,
  mobotix: mobotixDeck,
  inrae: inraeDeck,
  laposte: laposteDeck,
  earth: earthDeck,
  idf: idfDeck,
};

export const projects: Project[] = [
  {
    slug: 'renault-center-view',
    index: '01',
    client: 'Renault',
    title: 'Main levée',
    question: 'Comment créer le futur de l’interaction de la mobilité ?',
    year: '2024 — 2026',
    discipline: 'Design d’innovation',
    summary:
      'Un copilote qui propose, une conductrice qui décide : une boule donne un corps lisible à l’IA, l’écran explique, la voix et le volant décident.',
    tasks: [
      'Définir l’interaction et analyser le tableau de bord automobile',
      'Identifier les problèmes utilisateurs et formuler une problématique',
      'Élaborer un nouveau tableau de bord plus intuitif, simple et sécurisé',
      'Concevoir un nouveau volant et des boutons adaptés',
    ],
    theme: 'renault',
    cover: renaultCover,
    coverAlt:
      'Le copilote Main levée : une boule noire au logo Renault posée sur la planche de bord, à côté d’un bandeau d’écran qui affiche « Je vous écoute ».',
    thumb: renaultCompagnon,
    thumbAlt:
      'La boule-compagnon sur la planche de bord, visage lumineux souriant ; l’écran affiche « Bonjour Mélina, où allons-nous ? ».',
    // Dossier : recherche (1–11), volant (29–33), puis le copilote Main levée.
    deck: [
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 29, 30, 31, 32, 33].map((n) => slide(renaultDeck, n)),
      ...renaultCopiloteSlides,
    ],
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
  {
    slug: 'la-poste',
    index: '04',
    client: 'La Poste',
    title: 'Post-it',
    question: 'Quel avenir pour l’IA à La Poste ?',
    discipline: 'UX design & IA',
    summary:
      'Quinze entretiens, un site qu’on n’explore pas : Post-it, un assistant IA né du logo de La Poste pour guider chaque recherche.',
    tasks: [],
    context: 'Projet d’entreprise — CY École de Design',
    team: 'Gaspard Bayle, Kevidu D. Kussiyage, Alexandre Vo Thanh',
    theme: 'laposte',
    cover: slide(laposteDeck, 26),
    coverAlt:
      'Storyboard illustré : un usager perdu devant le site de La Poste, puis Post-it apparaît à l’écran et l’accompagne jusqu’à sa demande.',
    thumb: laposteMascot,
    thumbAlt: 'Post-it, la mascotte de l’assistant IA : un oiseau bleu à crête jaune, dérivé du logo de La Poste.',
    deck: laposteDeck,
    prototype: { href: 'https://postal-simplicity.lovable.app', label: 'Prototype Postal Simplicity' },
  },
  {
    slug: 'earth-to-earth',
    index: '05',
    client: 'Earth to Earth',
    title: 'EvoBIM',
    question:
      'Quelle organisation industrielle innovante pour optimiser la conception et la réalisation de bâtiments de logements abordables ?',
    discipline: 'Design systémique & innovation',
    summary:
      'Industrialiser des bâtiments évolutifs : une filière intégrée, du sourcing local à la maintenance, pilotée par une plateforme BIM 4.0.',
    tasks: [],
    context: 'Projet — CY École de Design',
    team: 'Gaspard Bayle, Matthys Tachon-Panafieu, Améline Guérineau',
    theme: 'earth',
    cover: earthCover,
    coverAlt: 'EvoBIM — « Penser en système. Construire l’avenir. » : le logo au-dessus d’une ligne de bâtiments dessinés et d’une grue.',
    thumb: earthBim,
    thumbAlt: 'Interface de la plateforme EvoBIM sur un ordinateur portable : maquette 3D du bâtiment et curseur de transformation.',
    deck: earthDeck,
    prototype: {
      href: 'https://www.figma.com/make/8D06cxDeiikSyaadFha6nV/BIM-4.0-Interface-Design?fullscreen=1&t=xAgHVvosUZ9dBJwq-1&code-node-id=0-9',
      label: 'Maquette EvoBIM (Figma Make)',
    },
  },
  {
    slug: 'manuels-scolaires-numeriques',
    index: '06',
    client: 'Région Île-de-France',
    title: 'Manuels scolaires numériques',
    question:
      'Comp-AI-gnons aide les lycéens à travailler leur manuel numérique avec un compagnon IA et une manette sensorielle, pour réviser à leur rythme et avec moins de stress.',
    discipline: 'UX & design produit',
    summary:
      'Vers un renouveau des habitudes pédagogiques : quatre compagnons IA et une manette haptique pour faire du manuel numérique un espace bienveillant.',
    tasks: [],
    context: 'Projet — CY École de Design',
    team: 'Gaspard Bayle, Kevidu D. Kussiyage, Alexandre Vo Thanh',
    role: 'Designer — impliqué à chaque étape, du terrain au test',
    selection: 'Conseil et innovation',
    theme: 'idf',
    cover: idfCover,
    coverAlt:
      'Les quatre Comp-AI-gnons — un caméléon, une tortue, un panda et un singe — en 3D sur un fond dégradé jaune-orange.',
    coverCaption:
      'À remarquer : quatre personnalités distinctes — l’animateur, le mentor, le complice, le calme — pour s’adapter à des élèves aux besoins très différents.',
    thumb: idfManette,
    thumbAlt: 'La manette interactive en rendu 3D, avec ses touches, ses lumières et son joystick annotés.',
    deck: idfDeck,
    prototype: { href: 'https://empathic-learning-grove.lovable.app/', label: 'Tester le prototype' },
    prototypeTop: true,
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

export const otherProjects: OtherProject[] = [];

export const getProject = (slug: string): Project => {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Projet inconnu : ${slug}`);
  return project;
};

export const getNextProject = (slug: string): Project => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
