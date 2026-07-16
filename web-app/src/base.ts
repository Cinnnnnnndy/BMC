/**
 * Resolve a public/ asset path against Vite's BASE_URL.
 * GitHub Pages serves the app under /<repo>/ (CI builds with --base /BMC/),
 * so absolute "/welcome.html" style paths 404 in production — always go
 * through this helper for iframes / fetches / images that live in public/.
 */
export function withBase(path: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
  const p = path.replace(/^\//, '');
  return base.endsWith('/') ? base + p : base + '/' + p;
}
