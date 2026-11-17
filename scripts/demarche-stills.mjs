/**
 * Rend les quatre vues fixes de la sculpture « Ma démarche » depuis la page elle-même.
 * Elles servent quand la 3D ne démarre pas ou que le mouvement réduit est demandé.
 *
 *   npm run build && npx astro preview --port 4400 &
 *   PLAYWRIGHT=/chemin/vers/playwright/index.mjs node scripts/demarche-stills.mjs
 */
import sharp from 'sharp';

const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright');
const url = process.env.URL ?? 'http://localhost:4400/';
const steps = ['observer', 'definir', 'explorer', 'eprouver'];

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url);
await page.addStyleTag({ content: '.dm__rail { visibility: hidden; }' });
await page.waitForSelector('.is-3d');

for (const [i, id] of steps.entries()) {
  await page.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
  await page.waitForTimeout(2000);
  const shot = await page.locator('.dm__canvas').screenshot();
  const meta = await sharp(shot).metadata();
  const height = Math.round(meta.width * 0.7);
  await sharp(shot)
    .extract({ left: 0, top: Math.round((meta.height - height) / 2), width: meta.width, height })
    .png({ compressionLevel: 9 })
    .toFile(`src/assets/demarche/etape-${i + 1}.png`);
  console.log(`etape-${i + 1}.png`);
}
await browser.close();
