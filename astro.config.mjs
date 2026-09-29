// @ts-check
import process from 'node:process';
import { defineConfig } from 'astro/config';

// SITE_URL  : URL publique absolue (canonical, Open Graph). Ex. https://gaspardbayle.fr
// BASE_PATH : sous-dossier de déploiement éventuel. Ex. /portfoliogas2 pour GitHub Pages.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  image: {
    // Les planches font 1920px et les affiches typo 3840px : on plafonne la génération.
    breakpoints: [480, 768, 1080, 1440, 1920],
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
