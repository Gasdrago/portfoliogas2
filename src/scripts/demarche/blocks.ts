/**
 * Essai comparatif — « Les blocs modulaires » : douze blocs épars qui s'assemblent en un volume.
 * Deux états seulement (Observer → Définir) : cet essai sert à comparer avec les fils.
 */
import * as THREE from 'three';
import { COLORS, ease, type Sculpture } from './stage';

interface Pose {
  p: [number, number, number];
  r: number; // rotation autour de y
}

const S = 0.5; // côté d'un bloc

// Observer : blocs dispersés, orientations diverses.
const scattered: Pose[] = [
  { p: [-2.2, 0, -0.6], r: 0.5 }, { p: [-1.5, 0, 0.7], r: -0.3 }, { p: [-1.0, 0, -0.9], r: 0.9 },
  { p: [-0.3, 0, 0.3], r: 0.2 }, { p: [0.3, 0, -0.5], r: -0.7 }, { p: [0.9, 0, 0.9], r: 0.4 },
  { p: [1.5, 0, -0.2], r: -0.2 }, { p: [2.2, 0, 0.5], r: 0.8 }, { p: [-1.9, 0, 0.1], r: -0.9 },
  { p: [0.1, 0, 1.0], r: 0.6 }, { p: [1.3, 0, -1.0], r: -0.5 }, { p: [2.0, 0, -0.8], r: 0.1 },
];

// Définir : un volume compact 3 × 2 × 2, le bloc orange en clé de voûte.
const assembled: Pose[] = Array.from({ length: 12 }, (_, i) => {
  const x = (i % 3) - 1;
  const z = Math.floor(i / 3) % 2;
  const y = Math.floor(i / 6);
  return { p: [x * S, y * S, (z - 0.5) * S], r: 0 };
});

export function createBlocks(): Sculpture {
  const group = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: COLORS.structure, roughness: 0.82 });
  const grey = new THREE.MeshStandardMaterial({ color: COLORS.graphite, roughness: 0.6 });
  const orange = new THREE.MeshStandardMaterial({ color: COLORS.signal, roughness: 0.5 });
  const geo = new THREE.BoxGeometry(S * 0.96, S * 0.96, S * 0.96);

  const blocks = scattered.map((_, i) => {
    const m = new THREE.Mesh(geo, i === 10 ? orange : i % 4 === 1 ? grey : white);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  });

  return {
    group,
    setProgress(p) {
      const q = Math.min(Math.max(p, 0), 1);
      blocks.forEach((m, i) => {
        // Les blocs partent l'un après l'autre.
        const t = ease(Math.min(Math.max(q * 1.6 - (i / 11) * 0.6, 0), 1));
        const a = scattered[i];
        const b = assembled[i];
        m.position.set(
          a.p[0] + (b.p[0] - a.p[0]) * t,
          S / 2 + a.p[1] + (b.p[1] - a.p[1]) * t + Math.sin(t * Math.PI) * 0.5,
          a.p[2] + (b.p[2] - a.p[2]) * t,
        );
        m.rotation.y = a.r * (1 - t);
      });
    },
  };
}
