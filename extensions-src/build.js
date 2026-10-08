const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const watch = process.argv.includes('--watch');

// esbuild doesn't load .env itself — parse it here and inject values via
// `define` so src/ files can reference process.env.API_BASE_URL, which is
// replaced with the literal string at build time (no runtime cost).
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(__dirname, '.env'), 'utf-8')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

// Two independent builds, deliberately different formats:
//
// - tryon-loader.js is loaded via a plain <script src=... defer> tag with
//   no type="module". It must be a classic script, so format: 'iife'.
//   It never imports Preact, so there's nothing to share/split here.
//
// - tryon-widget.js is loaded via loader.ts's dynamic import(). The
//   dynamic import() spec always loads its target as a module, regardless
//   of how the importing script was loaded — so this one MUST be
//   format: 'esm' with real exports (mountWidget), or the browser can't
//   resolve `mod.mountWidget` at all.
//
// Preact is fully bundled into tryon-widget.js (bundle: true), so no
// separate Preact <script> or CDN dependency is needed on the storefront.

const shared = {
  bundle: true,
  minify: true,
  sourcemap: watch ? 'inline' : false,
  define: {
    'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL ?? ''),
  },
  // es2020 baseline. Kept for parity with the shipped bundles (and the MediaPipe
  // runtime); safe for three.js + Preact.
  target: 'es2020',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  loader: { '.tsx': 'tsx', '.ts': 'ts' },
};

const builds = [
  {
    ...shared,
    entryPoints: { 'tryon-loader': 'src/loader.ts' },
    format: 'iife',
    outdir: '../extensions/mirrly/assets',
  },
  {
    ...shared,
    entryPoints: { 'tryon-widget': 'src/widget.tsx' },
    format: 'esm',
    outdir: '../extensions/mirrly/assets',
  },
  {
    // Nothing imports styles.css from JS (esbuild wouldn't auto-inject it
    // anyway), so it ships as its own asset, linked from the liquid block.
    entryPoints: { 'tryon-styles': 'src/styles.css' },
    bundle: true,
    minify: true,
    outdir: '../extensions/mirrly/assets',
  },
];

// The onboarding Step 4 live-test page (web/public/tryon/index.html) loads
// these same bundles from the app domain instead of Shopify's CDN. Copied via
// an onEnd plugin so watch mode keeps the copy fresh too.
const copyToWebPublic = {
  name: 'copy-to-web-public',
  setup(build) {
    build.onEnd(() => {
      const from = path.join(__dirname, '..', 'extensions', 'mirrly', 'assets');
      const to = path.join(__dirname, '..', 'web', 'public', 'tryon');
      fs.mkdirSync(to, { recursive: true });
      for (const file of ['tryon-widget.js', 'tryon-styles.css']) {
        fs.copyFileSync(path.join(from, file), path.join(to, file));
      }
    });
  },
};

async function run() {
  const contexts = await Promise.all(
    builds.map((cfg) => esbuild.context({ ...cfg, plugins: [...(cfg.plugins ?? []), copyToWebPublic] }))
  );

  if (watch) {
    await Promise.all(contexts.map((ctx) => ctx.watch()));
    console.log('watching for changes... (run `shopify app dev` alongside this)');
  } else {
    await Promise.all(contexts.map((ctx) => ctx.rebuild()));
    await Promise.all(contexts.map((ctx) => ctx.dispose()));
    console.log('build complete');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
