// Writes dist/research/remote-proprioception/index.html: a copy of the SPA shell with the
// paper's title and description, so link previews (Slack, X, LinkedIn) show the paper instead
// of the portfolio. Static files win over the catch-all rewrite in vercel.json.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const TITLE = 'Learned Remote Proprioception & Contact Force Estimation';
const DESCRIPTION =
  'Joint angles, contact force and contact onset for a sensorless, multi-tendon soft finger, learned from motor and load-cell signals alone. Under review at ICRA 2027.';
const OUT_DIR = 'dist/research/remote-proprioception';

const shell = readFileSync('dist/index.html', 'utf8');
const meta = [
  `<meta name="description" content="${DESCRIPTION}" />`,
  `<meta property="og:type" content="article" />`,
  `<meta property="og:title" content="${TITLE}" />`,
  `<meta property="og:description" content="${DESCRIPTION}" />`,
  `<meta name="twitter:card" content="summary" />`,
  `<meta name="twitter:title" content="${TITLE}" />`,
  `<meta name="twitter:description" content="${DESCRIPTION}" />`,
].join('\n    ');

const html = shell
  .replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`)
  .replace(/<meta name="description"[^>]*>/, meta)
  // The homepage hero image isn't needed here.
  .replace(/\s*<!--[^>]*hero[^>]*-->\s*<link rel="preload"[^>]*>/, '');

if (html === shell) throw new Error('prerender-research: index.html shell did not match');
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/index.html`, html);
console.log(`prerender-research: wrote ${OUT_DIR}/index.html`);
