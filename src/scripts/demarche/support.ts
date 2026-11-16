/** WebGL est-il disponible ? Module séparé : il ne doit pas entraîner le chargement de Three.js. */
export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
