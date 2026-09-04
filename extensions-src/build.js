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
  // es2020 minimum — the Decart SDK's WebRTC diagnostics use BigInt literals
  // (0n), which don't exist before ES2020. es2019 will fail the build.
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
];

async function run() {
  const contexts = await Promise.all(builds.map((cfg) => esbuild.context(cfg)));

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
