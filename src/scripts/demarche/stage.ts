/**
 * Scène commune aux sculptures de la page « Ma démarche » :
 * rendu, lumière, sol qui reçoit l'ombre, caméra cadrée sur le volume, rendu à la demande.
 */
import * as THREE from 'three';

export const COLORS = {
  structure: 0xfbf9f5,
  signal: 0xff4f1a,
  graphite: 0x4b4944,
  metal: 0x9a968e,
};

export interface Sculpture {
  group: THREE.Object3D;
  /** p est continu : 0 = première étape, 1 = deuxième, etc. */
  setProgress(p: number): void;
  /** Rayon de fil ou détail à adapter à la taille d'affichage (px par unité de scène). */
  setScale?(pxPerUnit: number): void;
}

export interface Stage {
  scene: THREE.Scene;
  add(sculpture: Sculpture): void;
  /** Cible de progression ; la scène la rejoint avec un léger amorti. */
  setTarget(p: number, immediate?: boolean): void;
  setActive(active: boolean): void;
  dispose(): void;
}

interface StageOptions {
  /** Demi-dimensions du volume à cadrer (largeur, hauteur). */
  halfWidth?: number;
  halfHeight?: number;
  centerY?: number;
  /** Marge de cadrage (1 = au plus juste) et hauteur de la vue, en radians. */
  fit?: number;
  elevation?: number;
  /** Suivi discret du pointeur. */
  parallax?: boolean;
  onContextLost?: () => void;
}

export function createStage(canvas: HTMLCanvasElement, options: StageOptions = {}): Stage {
  const { halfWidth = 2.75, halfHeight = 1.5, centerY = 0.95, fit = 1.12, elevation = 0.3, parallax = true, onContextLost } = options;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 60);
  const target = new THREE.Vector3(0, centerY, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xf1ece2, 2.3));
  const sun = new THREE.DirectionalLight(0xfffaf2, 1.5);
  sun.position.set(-3.5, 7, 4.5);
  sun.castShadow = true;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  sun.shadow.mapSize.setScalar(small ? 1024 : 2048);
  sun.shadow.camera.left = -4.5;
  sun.shadow.camera.right = 4.5;
  sun.shadow.camera.top = 4.5;
  sun.shadow.camera.bottom = -4.5;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 20;
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.015;
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const sculptures: Sculpture[] = [];
  let goal = 0;
  let current = -1;
  let active = true;
  let raf = 0;
  let dirty = true;
  let pxPerUnit = 100;
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };

  // Vue de trois quarts, légèrement plongeante.
  const AZIMUTH = -0.5;
  const ELEVATION = elevation;

  function placeCamera() {
    const az = AZIMUTH + pointer.cx * 0.1 + (current > 0 ? current : 0) * 0.035;
    const el = ELEVATION - pointer.cy * 0.05;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const dist = Math.max(halfHeight / Math.tan(vFov / 2), halfWidth / Math.tan(hFov / 2)) * fit;
    camera.position.set(
      target.x + dist * Math.sin(az) * Math.cos(el),
      target.y + dist * Math.sin(el),
      target.z + dist * Math.cos(az) * Math.cos(el),
    );
    camera.lookAt(target);
    pxPerUnit = canvas.clientHeight / (2 * dist * Math.tan(vFov / 2));
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    placeCamera();
    for (const s of sculptures) s.setScale?.(pxPerUnit);
    forceUpdate = true;
    dirty = true;
    schedule();
  }

  let forceUpdate = true;

  function frame() {
    raf = 0;
    if (!active) return;
    const dp = goal - current;
    const dx = pointer.x - pointer.cx;
    const dy = pointer.y - pointer.cy;
    const moving = Math.abs(dp) > 0.0005 || Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001;
    if (!moving && !dirty) return;

    if (Math.abs(dp) > 0.0005) current += dp * 0.16;
    else current = goal;
    pointer.cx += dx * 0.08;
    pointer.cy += dy * 0.08;

    if (Math.abs(dp) > 0 || forceUpdate) for (const s of sculptures) s.setProgress(current);
    forceUpdate = false;
    placeCamera();
    renderer.render(scene, camera);
    dirty = false;
    if (moving) schedule();
  }

  function schedule() {
    if (!raf && active) raf = requestAnimationFrame(frame);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    schedule();
  };
  if (parallax) window.addEventListener('pointermove', onPointer, { passive: true });

  const onLost = (e: Event) => {
    e.preventDefault();
    active = false;
    onContextLost?.();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  const onVisibility = () => {
    if (!document.hidden) {
      dirty = true;
      schedule();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    scene,
    add(s) {
      sculptures.push(s);
      scene.add(s.group);
      s.setScale?.(pxPerUnit);
      forceUpdate = true;
      dirty = true;
      schedule();
    },
    setTarget(p, immediate = false) {
      goal = p;
      if (immediate || current < 0) {
        current = p;
        forceUpdate = true;
        dirty = true;
      }
      schedule();
    },
    setActive(a) {
      if (a === active) return;
      active = a;
      if (a) {
        dirty = true;
        schedule();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      renderer.dispose();
    },
  };
}

/** Poids d'une étape k à la progression p : 1 sur l'étape, 0 à une étape d'écart. */
export function weight(p: number, k: number): number {
  const w = Math.max(0, 1 - Math.abs(p - k));
  return w * w * (3 - 2 * w);
}

export function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
