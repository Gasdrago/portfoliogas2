/**
 * Informations globales — issues du CV (public/cv/gaspard-bayle-cv.pdf).
 * Ne rien ajouter ici qui ne soit pas vérifiable.
 */
export const site = {
  name: 'Gaspard Bayle',
  shortName: 'G. Bayle',
  role: 'Designer global & ingénieur informatique',
  description:
    'Portfolio de Gaspard Bayle — double cursus Designer global et Ingénieur informatique (CY École de Design × CY Tech). Design d’innovation, UX/UI, design produit : de la recherche terrain à l’interface.',
  lang: 'fr',
  locale: 'fr_FR',
  email: 'gas.d.bayle@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gaspard-bayle-67171a301',
  cv: 'cv/gaspard-bayle-cv.pdf',
  education: {
    degree: 'Master Designer global & Ingénieur informatique',
    schools: 'CY École de Design × CY Tech',
    period: '2021 — 2027',
  },
  companyProjects: 16,
} as const;

export const nav = [
  { label: 'Projets', href: 'projets/' },
  { label: 'Lab', href: 'lab/' },
  { label: 'À propos', href: 'a-propos/' },
] as const;
