/**
 * Recadrages éditoriaux des planches (génère src/assets/crops/*.jpg).
 * Les planches originales restent intactes ; relancer : `node scripts/crops.mjs`.
 * Coordonnées en pixels sur les planches 1920×1080.
 */
import sharp from 'sharp';

const crops = [
  // Maquettes Sun Scan sans la bulle de légende — format 4:5 et carré.
  { src: 'mobotix/20.png', out: 'mobotix-app-portrait.jpg', left: 372, top: 0, width: 704, height: 880 },
  { src: 'mobotix/20.png', out: 'mobotix-app-square.jpg', left: 330, top: 40, width: 840, height: 840 },
  // Rendu 3D du volant, sans le bloc de texte de la planche.
  { src: 'renault/29.png', out: 'renault-volant.jpg', left: 0, top: 60, width: 1020, height: 1020 },
];

for (const c of crops) {
  await sharp(`src/assets/projects/${c.src}`)
    .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(`src/assets/crops/${c.out}`);
  console.log('✓', c.out);
}
