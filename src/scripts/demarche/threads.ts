/**
 * Sculpture « Les lignes de tension » : sept fils tendus entre un banc et un portique.
 * Quatre états — ouvert, convergent, rouvert en trois faisceaux, stabilisé en parallèle.
 * Chaque fil est décrit par cinq points de contrôle par état ; on interpole entre états.
 */
import * as THREE from 'three';
import { COLORS, ease, weight, type Sculpture } from './stage';

const N = 7; // fils
const K = 5; // points de contrôle par fil
const SAMPLES = 56;
const RADIAL = 6;

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const mix = (a: THREE.Vector3, b: THREE.Vector3, t: number) => a.clone().lerp(b, t);

// --- Structure fixe -------------------------------------------------------
const BENCH_X = -2.2;
const BENCH_Y = 0.34;
const FRAME_X = 2.2;
const FRAME_H = 2.25;
const FRAME_HALF = 0.72; // demi-largeur du portique (axe z)
const BAR = 0.1;
const MID_X = 0.35;
const MID_H = 1.75;
const MID_HALF = 0.8;
const EYELET = V(-0.35, 1.02, 0);

const benchZ = (i: number, spread = 0.78) => THREE.MathUtils.lerp(-spread, spread, i / (N - 1));
const post = (side: number, y: number) => V(FRAME_X - BAR / 2, y, side * FRAME_HALF);

// --- États ----------------------------------------------------------------
type State = THREE.Vector3[][]; // [fil][point]

function line(a: THREE.Vector3, m: THREE.Vector3, b: THREE.Vector3): THREE.Vector3[] {
  // Points voisins du sommet : le fil reste tendu, l'arrondi est local.
  return [a, mix(a, m, 0.86), m, mix(m, b, 0.14), b];
}

// 1. Observer — les fils partent dans toutes les directions, se croisent, deux sont déviés.
const observe: State = (() => {
  const ends = [post(1, 1.95), post(-1, 0.75), post(1, 0.55), post(-1, 2.05), post(-1, 1.35), post(1, 1.25), post(-1, 0.35)];
  const kink: Record<number, THREE.Vector3> = { 1: V(-0.7, 1.55, 0.35), 4: V(0.1, 0.45, -0.5) };
  return ends.map((e, i) => {
    const s = V(BENCH_X, BENCH_Y, benchZ(i));
    return line(s, kink[i] ?? mix(s, e, 0.5), e);
  });
})();

// 2. Définir — tous les fils passent par un seul œillet, puis s'ordonnent en éventail.
const define: State = Array.from({ length: N }, (_, i) => {
  const s = V(BENCH_X, BENCH_Y, benchZ(i));
  const e = post(i % 2 ? -1 : 1, THREE.MathUtils.lerp(2.0, 0.4, i / (N - 1)));
  return line(s, EYELET, e);
});

// 3. Explorer — trois faisceaux traversent un cadre intermédiaire, puis se rejoignent.
const explore: State = (() => {
  const mids = [
    V(MID_X, 0.55, -MID_HALF), V(MID_X, 0.75, -MID_HALF),
    V(MID_X, MID_H, -0.22), V(MID_X, MID_H, 0), V(MID_X, MID_H, 0.22),
    V(MID_X, 0.95, MID_HALF), V(MID_X, 0.75, MID_HALF),
  ];
  return mids.map((m, i) => {
    const s = V(BENCH_X, BENCH_Y, benchZ(i));
    const e = post(-1, THREE.MathUtils.lerp(1.0, 1.42, i / (N - 1)));
    return line(s, m, e);
  });
})();

// 4. Éprouver — les fils se rangent en parallèle et montent d'un même mouvement.
const prove: State = Array.from({ length: N }, (_, i) => {
  const z = benchZ(i, 0.48);
  return [
    V(BENCH_X, BENCH_Y, z),
    V(-1.15, 0.42, z),
    V(0, 1.22, z),
    V(1.15, FRAME_H - BAR - 0.08, z),
    V(FRAME_X - BAR / 2, FRAME_H - BAR, z),
  ];
});

const STATES: State[] = [observe, define, explore, prove];

// --- Géométrie ------------------------------------------------------------
function beam(mat: THREE.Material, sx: number, sy: number, sz: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Portique dans le plan y-z, posé au sol, origine au pied. */
function portal(mat: THREE.Material, half: number, height: number, bar: number) {
  const g = new THREE.Group();
  g.add(beam(mat, bar, height, bar, 0, height / 2, -half));
  g.add(beam(mat, bar, height, bar, 0, height / 2, half));
  g.add(beam(mat, bar, bar, half * 2 + bar, 0, height - bar / 2, 0));
  g.add(beam(mat, bar, bar, half * 2 + bar, 0, bar / 2, 0));
  return g;
}

export function createThreads(maxState = STATES.length - 1): Sculpture {
  const group = new THREE.Group();
  const structure = new THREE.MeshStandardMaterial({ color: COLORS.structure, roughness: 0.82 });
  const orange = new THREE.MeshStandardMaterial({ color: COLORS.signal, roughness: 0.45, emissive: COLORS.signal, emissiveIntensity: 0.45 });
  const graphite = new THREE.MeshStandardMaterial({ color: COLORS.graphite, roughness: 0.5, emissive: COLORS.graphite, emissiveIntensity: 0.35 });
  const metal = new THREE.MeshStandardMaterial({ color: COLORS.metal, roughness: 0.35, metalness: 0.6 });

  // Banc
  const bench = new THREE.Group();
  bench.add(beam(structure, 0.16, 0.1, 1.9, BENCH_X, BENCH_Y - 0.05, 0));
  bench.add(beam(structure, 0.16, BENCH_Y - 0.1, 0.12, BENCH_X, (BENCH_Y - 0.1) / 2, -0.89));
  bench.add(beam(structure, 0.16, BENCH_Y - 0.1, 0.12, BENCH_X, (BENCH_Y - 0.1) / 2, 0.89));
  group.add(bench);

  // Portique d'arrivée
  const far = portal(structure, FRAME_HALF, FRAME_H, BAR);
  far.position.x = FRAME_X;
  group.add(far);

  // Cadre intermédiaire (Explorer)
  const mid = portal(structure, MID_HALF, MID_H, 0.08);
  mid.position.x = MID_X;
  group.add(mid);

  // Longerons (Éprouver) : le portique devient une cage qui tient l'ensemble.
  const cage = new THREE.Group();
  const span = FRAME_X - BENCH_X;
  const cx = (FRAME_X + BENCH_X) / 2;
  for (const side of [-1, 1]) {
    cage.add(beam(structure, span, BAR, BAR, cx, FRAME_H - BAR / 2, side * FRAME_HALF));
    cage.add(beam(structure, BAR, FRAME_H, BAR, BENCH_X - 0.02, FRAME_H / 2, side * FRAME_HALF));
  }
  cage.add(beam(structure, BAR, BAR, FRAME_HALF * 2 + BAR, BENCH_X - 0.02, FRAME_H - BAR / 2, 0));
  group.add(cage);

  // Œillet (Définir)
  const eyelet = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.026, 12, 40), orange);
  eyelet.position.copy(EYELET);
  eyelet.rotation.y = Math.PI / 2;
  eyelet.castShadow = true;
  group.add(eyelet);

  // Fils : un tube par fil, dont on réécrit les sommets.
  const ring = RADIAL + 1;
  const index: number[] = [];
  for (let j = 0; j < SAMPLES; j++) {
    for (let r = 0; r < RADIAL; r++) {
      const a = j * ring + r;
      const b = a + ring;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const threads = Array.from({ length: N }, (_, i) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SAMPLES + 1) * ring * 3), 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array((SAMPLES + 1) * ring * 3), 3));
    geo.setIndex(index);
    const mesh = new THREE.Mesh(geo, i % 2 ? graphite : orange);
    mesh.castShadow = true;
    mesh.frustumCulled = false;
    group.add(mesh);
    const points = Array.from({ length: K }, () => new THREE.Vector3());
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    return { geo, points, curve };
  });

  // Attaches aux deux extrémités
  const nutGeo = new THREE.CylinderGeometry(0.034, 0.034, 0.03, 12);
  const nuts = Array.from({ length: N * 2 }, () => {
    const m = new THREE.Mesh(nutGeo, metal);
    m.castShadow = true;
    group.add(m);
    return m;
  });

  let radius = 0.016;
  const P = new THREE.Vector3();
  const T = new THREE.Vector3();
  const Nn = new THREE.Vector3();
  const B = new THREE.Vector3();
  const UP = new THREE.Vector3(0, 1, 0);
  const ALT = new THREE.Vector3(0, 0, 1);

  function writeTube(t: (typeof threads)[number]) {
    const pos = t.geo.getAttribute('position') as THREE.BufferAttribute;
    const nor = t.geo.getAttribute('normal') as THREE.BufferAttribute;
    for (let j = 0; j <= SAMPLES; j++) {
      const u = j / SAMPLES;
      t.curve.getPoint(u, P);
      t.curve.getTangent(u, T);
      Nn.crossVectors(T, Math.abs(T.y) > 0.95 ? ALT : UP).normalize();
      B.crossVectors(T, Nn).normalize();
      for (let r = 0; r <= RADIAL; r++) {
        const a = (r / RADIAL) * Math.PI * 2;
        const cx = Math.cos(a);
        const sx = Math.sin(a);
        const nx = Nn.x * cx + B.x * sx;
        const ny = Nn.y * cx + B.y * sx;
        const nz = Nn.z * cx + B.z * sx;
        const k = j * ring + r;
        pos.setXYZ(k, P.x + nx * radius, P.y + ny * radius, P.z + nz * radius);
        nor.setXYZ(k, nx, ny, nz);
      }
    }
    pos.needsUpdate = true;
    nor.needsUpdate = true;
  }

  function grow(obj: THREE.Object3D, w: number) {
    obj.visible = w > 0.004;
    obj.scale.y = Math.max(w, 0.004);
  }

  let last = 0;

  function setProgress(p: number) {
    last = p;
    const q = THREE.MathUtils.clamp(p, 0, maxState);
    const a = Math.min(Math.floor(q), Math.max(maxState - 1, 0));
    const b = Math.min(a + 1, maxState);
    const t = ease(q - a);
    const A = STATES[a];
    const Bs = STATES[b];

    threads.forEach((th, i) => {
      for (let k = 0; k < K; k++) th.points[k].lerpVectors(A[i][k], Bs[i][k], t);
      writeTube(th);
      const s = nuts[i * 2];
      const e = nuts[i * 2 + 1];
      s.position.copy(th.points[0]);
      e.position.copy(th.points[K - 1]);
      // L'attache d'arrivée est sur un montant (axe x) ou sous la traverse (axe y).
      const onTop = th.points[K - 1].y > FRAME_H - BAR - 0.02;
      e.rotation.z = onTop ? 0 : Math.PI / 2;
    });

    const wEye = weight(q, 1);
    eyelet.visible = wEye > 0.004;
    eyelet.scale.setScalar(Math.max(wEye, 0.004));
    grow(mid, weight(q, 2));
    grow(cage, weight(q, 3));
  }

  return {
    group,
    setProgress,
    setScale(pxPerUnit) {
      // Un fil reste lisible sur téléphone : jamais moins d'environ 2,4 px d'épaisseur.
      radius = THREE.MathUtils.clamp(1.2 / pxPerUnit, 0.013, 0.024);
      setProgress(last);
    },
  };
}
