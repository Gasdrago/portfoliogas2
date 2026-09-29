const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Préfixe un chemin interne avec la base de déploiement. `href('projets/')` → `/projets/` */
export function href(path = ''): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Compare le chemin courant à un lien de navigation. */
export function isCurrent(pathname: string, path: string): boolean {
  const target = href(path);
  return target === href('') ? pathname === target : pathname.startsWith(target);
}
