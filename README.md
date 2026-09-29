# Gaspard Bayle — Portfolio

Portfolio de Gaspard Bayle, double cursus **Designer global & Ingénieur informatique**
(CY École de Design × CY Tech).

Site statique construit avec [Astro](https://astro.build) : HTML généré au build,
~4 Ko de JavaScript côté client, images responsives (WebP + `srcset`).

## Commandes

```bash
npm install
npm run dev       # serveur de développement — http://localhost:4321
npm run build     # vérification des types (astro check) + build dans dist/
npm run preview   # sert le build de production
node scripts/crops.mjs   # régénère les recadrages éditoriaux (src/assets/crops)
```

Node ≥ 22.12 requis.

## Déploiement

Le build (`dist/`) se déploie sur n'importe quel hébergement statique
(Netlify, Vercel, Cloudflare Pages, GitHub Pages…). Deux variables d'environnement
optionnelles :

| Variable    | Rôle                                                                  | Exemple                          |
| ----------- | --------------------------------------------------------------------- | -------------------------------- |
| `SITE_URL`  | URL publique : active les balises `canonical` et les URL absolues OG | `https://gaspardbayle.fr`        |
| `BASE_PATH` | Sous-dossier de déploiement                                           | `/portfoliogas2` (GitHub Pages) |

### GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque push
sur `main` (ou manuellement depuis l'onglet *Actions*) sur
**https://gasdrago.github.io/portfoliogas2/**.
Activation, une seule fois : *Settings → Pages → Build and deployment → Source :
GitHub Actions*.

## Structure

```
src/
  assets/
    projects/{renault,mobotix,inrae}/   planches originales (numérotées)
    lab/{typographie,3d,illustration}/  productions du Lab
    crops/                              recadrages générés (scripts/crops.mjs)
    brand/                              portrait, logos
  data/
    site.ts        identité, contact, formation (source : CV)
    projects.ts    projets (Renault, INRAE, Mobotix, La Poste, Earth to Earth) + autres (IDF)
    lab.ts         séries du Lab
  styles/
    tokens.css     design tokens : couleurs, thèmes projet, typo, espacements, motion
    base.css       reset, primitives (grille, liens, boutons, tags), révélations, transitions
  components/      éléments partagés (Figure, ProjectCard, ProjectIndex…)
  components/case/ blocs d'étude de cas (CaseSection, Quotes, BarChart, Feature…)
  layouts/         Base (SEO, en-tête, pied de page), CaseStudy
  pages/           accueil, projets, études de cas, lab, à propos, 404
  scripts/         interactions (révélations, en-tête, curseur, visionneuse…)
public/
  cv/              CV PDF
  media/           vidéo d'ambiance compressée
sources/           originaux non publiés (vidéos brutes, visuels écartés)
```

## Design system

- **Couleurs** — papier `#f1efea`, encre `#111110`, un seul accent « signal » `#ff4f1a`.
  Chaque étude de cas reprend la palette de son dossier via `[data-theme]`
  (`renault`, `mobotix`, `inrae`, `inrae-light`, `night`).
- **Typographie** — trois voix : Instrument Sans (structure, titres étroits via l'axe
  `wdth`), Instrument Serif italique (voix du designer), JetBrains Mono
  (voix de l'ingénieur : métadonnées, index).
- **Échelle fluide** `--step--2` → `--step-5`, espacements `--space-3xs` → `--space-3xl`,
  grille 4 / 12 colonnes, marges `--gutter`.
- **Mouvement** — courbes `--ease-out`, `--ease-in-out`, durées `--dur-1` → `--dur-4`.
  Toutes les animations sont neutralisées sous `prefers-reduced-motion`.

## Ajouter ou compléter un projet

1. Déposer les planches dans `src/assets/projects/<slug>/01.png, 02.png…`.
2. Ajouter l'entrée dans `src/data/projects.ts` (les champs optionnels `team`, `role`,
   `duration`, `outcome` s'affichent automatiquement dans l'en-tête de l'étude
   dès qu'ils sont renseignés).
3. Créer `src/pages/projets/<slug>.astro` en composant les blocs de `components/case/`.

## Contenus à compléter

- **Projet IDF** — le prototype en ligne (`empathic-learning-grove.lovable.app`) n'a pas pu
  être consulté lors de la refonte : seule une ligne d'index pointe vers lui.
  Renseigner contexte, année et description dans `otherProjects` (`src/data/projects.ts`),
  ou fournir des visuels pour en faire une étude de cas.
- **Rôle et équipe** de chaque projet (`role`, `team`) — non précisés dans les dossiers.
- **Résultats / retours du POC Mobotix** — le dossier décrit le dispositif, pas le résultat.
- **Année INRAE** — le CV indique 2025, la couverture du dossier 2024 (2025 retenu).
