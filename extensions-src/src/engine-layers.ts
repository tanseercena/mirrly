// Garment layers for the client-side runtime engine (runtime-engine.ts).
// One layer per active garment slot: a texture-mapped mesh whose vertices
// are driven by MediaPipe pose landmarks each frame.
//
// Two layer kinds:
// - Quad layers (clothing): a subdivided plane whose four corners are the
//   shoulder/hip (or hip/knee) landmarks — the geometry warps as the body
//   moves. Used for clothing with no rig, i.e. the best-effort fallback,
//   and for rig v1 clothing (corners come from rig.anchor_points.corners).
// - Rigid layers (accessories): a flat plane translated/rotated/scaled by
//   anchor/angle/width landmark sets — the geometric-heuristic approach the
//   design principles require for today (no ML for accessories) and keep.

import * as THREE from 'three';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import type { EngineLayer } from './types';

// Painter's-algorithm order per slot: bottoms behind dress behind top behind
// jacket; accessories above all clothing (the runtime doc's explicit
// render-order groups). All meshes are transparent with depthTest off, so
// this map IS the z-ordering between slots.
const SLOT_RENDER_ORDER: Record<string, number> = {
  pants: 0,
  shorts: 0,
  skirt: 0,
  shoes: 0,
  dress: 1,
  top: 2,
  jacket: 3,
  bag: 4,
  necklace: 4,
  cap: 5,
  glasses: 6,
};

// MediaPipe pose landmark indices used as geometric drivers.
export const LM = {
  NOSE: 0,
  LEFT_EYE: 2,
  RIGHT_EYE: 5,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

// Best-effort geometric defaults per template type — what renders when a
// layer has no rig anchor_points (the normal case until the ingestion
// pipeline exists). Accessories are ALWAYS geometric (design principle).
// angle/width entries are [from, to] landmark pairs.
interface DriverConfig {
  kind: 'quad' | 'rigid';
  quad?: [tl: number, tr: number, bl: number, br: number];
  position: number[];
  angle: [number, number];
  width: [number, number];
  // Normalized offset from the anchor midpoint (x × frame width, y × frame height).
  offset: { x: number; y: number };
  // Rigid garments: mesh width = widthFactor × distance between width landmarks.
  widthFactor: number;
  // Rig v2 correspondences (accessories): garment anchor + the body landmark
  // it sits on. ≥2 pairs → per-frame similarity transform of the garment
  // image rect (rotation + scale + translation measured per product).
  pairs?: Array<{ g: { x: number; y: number }; lm: number }>;
  // Rig v2 (accessories): pin one garment anchor to a body reference point
  // (average of lm) + vertical offset in width-span units. Overrides the
  // correspondence-centroid translation, which sags for items whose mass
  // sits above their anchors (a cap's crown is above its brim).
  pin?: { g: { x: number; y: number }; lm: number[]; offsetY: number };
  // Rig v2 (clothing): UV corners for the quad, from the garment's actual
  // shoulder/hem anchor positions — the warp targets the template's body
  // landmarks but texture-maps this specific garment correctly.
  uvCorners?: Array<{ u: number; v: number }>;
}

// Garment anchor name → MediaPipe pose landmark index, per accessory type.
// The bridge between pipeline rigs (garment-space anchors) and body space.
// Side naming is IMAGE-side (shoulder_left sits at image x≈0.18 in a
// front-facing flat-lay) = the wearer's RIGHT side in raw video space.
// (MediaPipe: 0 nose, 2/5 eyes, 7/8 ears, 11/12 shoulders, 23/24 hips,
// 29/30 heels, 31/32 foot index.)
const ANCHOR_TO_BODY: Record<string, Record<string, number>> = {
  glasses: { lens_left: 5, lens_right: 2, bridge: 0, temple_left: 8, temple_right: 7 },
  cap: { side_left: 8, side_right: 7, brim_front: 0 },
  shoes: { toe_left: 32, heel_left: 30, toe_right: 31, heel_right: 29 },
  necklace: { clasp_left: 12, clasp_right: 11 },
  bag: { side_left: 12, side_right: 11 },
};

// Translation pin per accessory: which garment anchor sits on which body
// reference (average of lm indices), offset in units of the width-pair span
// (negative = up). Pose has no forehead landmark, so a cap's brim pins to
// the EYE LINE lifted above it — centroid placement sags onto the face
// because the crown's mass is above every anchor the pipeline emits.
const RIGID_PIN: Record<string, { anchor: string; lm: number[]; offsetY: number }> = {
  cap: { anchor: 'brim_front', lm: [2, 5], offsetY: -0.3 },
  glasses: { anchor: 'bridge', lm: [2, 5], offsetY: -0.1 },
  necklace: { anchor: 'pendant', lm: [11, 12], offsetY: 0.45 },
  bag: { anchor: 'handle_top', lm: [11, 12], offsetY: 0.15 },
};

// Clothing quads: rig anchor (garment-space) feeding each quad corner's UV —
// [tl, tr, bl, br], matching the quad landmark order in DEFAULT_DRIVERS
// (tl = person's right shoulder = garment's image-left shoulder, etc.).
const CLOTHING_UV_ANCHORS = ['shoulder_left', 'shoulder_right', 'hem_left', 'hem_right'] as const;

// Compact builders so each entry reads as one line.
const rigid = (
  position: number[],
  angle: [number, number],
  width: [number, number],
  offset: { x: number; y: number },
  widthFactor: number
): DriverConfig => ({ kind: 'rigid', position, angle, width, offset, widthFactor });

const quad = (tl: number, tr: number, bl: number, br: number): DriverConfig => ({
  kind: 'quad',
  quad: [tl, tr, bl, br],
  position: [tl, tr],
  angle: [tl, tr] as [number, number],
  width: [tl, tr],
  offset: { x: 0, y: 0 },
  widthFactor: 1,
});

// Best-effort geometric drivers per template type. Shoulder/hip quads for
// clothing; anchor/angle/width sets for accessories (accessories are always
// geometric — design principle). Clothing defaults serve until trained-model
// rigs exist.
const DEFAULT_DRIVERS: Record<string, DriverConfig> = {
  // (12/11 shoulders, 24/23 hips, 26/25 knees, 27/28 ankles)
  top: quad(12, 11, 24, 23),
  jacket: quad(12, 11, 24, 23),
  dress: quad(12, 11, 26, 25),
  pants: quad(24, 23, 26, 25),
  shorts: quad(24, 23, 26, 25),
  skirt: quad(24, 23, 26, 25),
  cap: rigid([0], [7, 8], [7, 8], { x: 0, y: -0.1 }, 1.6),
  glasses: rigid([0], [2, 5], [2, 5], { x: 0, y: -0.02 }, 1.5),
  necklace: rigid([11, 12], [11, 12], [11, 12], { x: 0, y: 0.07 }, 0.7),
  bag: rigid([11, 12], [11, 12], [11, 12], { x: 0, y: 0.15 }, 0.6),
  shoes: rigid([27, 28], [27, 28], [27, 28], { x: 0, y: 0.05 }, 1.4),
};

// A live layer in the scene: its mesh(es) plus a per-frame update driven by
// the current pose landmarks.
export interface ActiveLayer {
  // Garment slot this layer fills.
  slot: string;
  update(landmarks: NormalizedLandmark[] | null): void;
  dispose(): void;
}

// Load a texture cross-origin-safe. Resolves null when the image can't be
// loaded (the layer is skipped — never blocks the try-on).
async function loadTexture(url: string): Promise<THREE.Texture | null> {
  try {
    const texture = await new THREE.TextureLoader().loadAsync(url);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  } catch {
    return null;
  }
}

// Landmark → pixel coordinates in the raw (unmirrored) video frame. The
// overlay canvas is CSS-mirrored exactly like the video element, so drawing
// in raw frame coordinates lines up pixel-perfect on screen.
function toPixels(lm: NormalizedLandmark, w: number, h: number): THREE.Vector3 {
  return new THREE.Vector3(lm.x * w, lm.y * h, 0);
}

function distance(a: THREE.Vector3, b: THREE.Vector3): number {
  return a.distanceTo(b);
}

// Average landmark visibility — the fade signal. MediaPipe reports per-
// landmark visibility (0..1): low when occluded, out of frame or turned
// away. Feeds the doc's "fade toward 0 rather than render a broken warp".
function avgVisibility(landmarks: NormalizedLandmark[], indices: number[]): number {
  let sum = 0;
  let count = 0;
  for (const i of indices) {
    const lm = landmarks[i];
    if (!lm) continue;
    count += 1;
    sum += lm.visibility ?? 1;
  }
  return count > 0 ? sum / count : 0;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// Average pixel position of a landmark set (rigid anchor midpoint).
function averagePixel(
  landmarks: NormalizedLandmark[],
  indices: number[],
  w: number,
  h: number
): THREE.Vector3 | null {
  const sum = new THREE.Vector3();
  let count = 0;
  for (const i of indices) {
    const lm = landmarks[i];
    if (!lm) continue;
    sum.add(toPixels(lm, w, h));
    count += 1;
  }
  return count > 0 ? sum.multiplyScalar(1 / count) : null;
}

// Driver-config offset converted to pixels.
function offsetPixels(
  offset: { x: number; y: number },
  w: number,
  h: number
): THREE.Vector3 {
  return new THREE.Vector3(offset.x * w, offset.y * h, 0);
}

// Quad bottom corners (hips). MediaPipe's hip estimates degenerate when the
// lower body is out of frame — they drift up near the shoulders, squashing
// the whole garment onto the chest ("sticker" look). When the hip line is
// implausible relative to the shoulders (too high, or narrower than a third
// of the shoulder span), synthesize it: hips ≈ one shoulder-span below the
// shoulders, directly under them.
function torsoHips(top: THREE.Vector3[], bottom: THREE.Vector3[]): THREE.Vector3[] {
  const shoulderMidY = (top[0].y + top[1].y) / 2;
  const shoulderSpan = distance(top[0], top[1]);
  const hipMidY = (bottom[0].y + bottom[1].y) / 2;
  const hipSpan = distance(bottom[0], bottom[1]);

  const plausible =
    hipMidY > shoulderMidY + shoulderSpan * 0.5 && hipSpan > shoulderSpan * 0.35;
  if (plausible) return bottom;

  const drop = new THREE.Vector3(0, shoulderSpan * 1.35, 0);
  return [top[0].clone().add(drop), top[1].clone().add(drop)];
}

// Similarity transform from rig correspondences: rotation + scale from the
// farthest-apart pair (most stable), translation from the correspondence
// centroid. Garment anchors are normalized within the cutout — converted to
// frame-width units so distances are undistorted (uniform scale).
function similarityCorners(
  landmarks: NormalizedLandmark[],
  pairs: Array<{ g: { x: number; y: number }; lm: number }>,
  w: number,
  h: number,
  aspect: number,
  pin?: { g: { x: number; y: number }; lm: number[]; offsetY: number }
): THREE.Vector3[] | null {
  const S = w;
  const pts: Array<{ g: THREE.Vector3; b: THREE.Vector3 }> = [];
  for (const pair of pairs) {
    const lm = landmarks[pair.lm];
    if (!lm) continue;
    pts.push({
      g: new THREE.Vector3(pair.g.x * S, pair.g.y * S, 0),
      b: toPixels(lm, w, h),
    });
  }
  if (pts.length < 2) return null;

  // Primary pair = farthest apart in garment space.
  let a = pts[0];
  let b = pts[0];
  let best = -1;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = pts[i].g.distanceTo(pts[j].g);
      if (d > best) {
        best = d;
        a = pts[i];
        b = pts[j];
      }
    }
  }
  const scale = a.b.distanceTo(b.b) / Math.max(a.g.distanceTo(b.g), 1e-6);
  const ang =
    Math.atan2(b.b.y - a.b.y, b.b.x - a.b.x) - Math.atan2(b.g.y - a.g.y, b.g.x - a.g.x);
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);

  // Translation from the correspondence centroid (all pairs — more stable
  // than the primary pair alone).
  const gc = new THREE.Vector3();
  const bc = new THREE.Vector3();
  for (const p of pts) {
    gc.add(p.g);
    bc.add(p.b);
  }
  gc.multiplyScalar(1 / pts.length);
  bc.multiplyScalar(1 / pts.length);

  // Translation target: the pin (garment anchor → body reference, lifted by
  // offsetY × width-span) when available — centroid placement sags for
  // items whose mass sits above their anchors (a cap's crown is above its
  // brim). Falls back to the correspondence centroid when the pin's anchor
  // or its body landmarks are missing.
  const span = a.b.distanceTo(b.b);
  let target = bc;
  let gOrigin = gc;
  if (pin) {
    const body = averagePixel(landmarks, pin.lm, w, h);
    if (body) {
      body.y += pin.offsetY * span;
      target = body;
      gOrigin = new THREE.Vector3(pin.g.x * S, pin.g.y * S, 0);
    }
  }

  // Garment image rect in g-space, y down, uv (0,0) at image top-left.
  // Order matches applyCorners' destructuring: [tl, tr, bl, br].
  const H = S * aspect;
  const rect = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(S, 0, 0),
    new THREE.Vector3(0, H, 0),
    new THREE.Vector3(S, H, 0),
  ];
  return rect.map((c) => {
    const dx = (c.x - gOrigin.x) * scale;
    const dy = (c.y - gOrigin.y) * scale;
    return new THREE.Vector3(
      target.x + (dx * cos - dy * sin),
      target.y + (dx * sin + dy * cos),
      0
    );
  });
}

// Fade behavior: below this visibility the garment fades out (a broken/
// stretched warp looks worse than no garment).
const FADE_ON = 0.35;
const FADE_OFF = 0.2;
// Opacity lerp per frame toward the fade target.
const FADE_LERP = 0.15;
// Subdivision of quad layers — vertices interpolate between the four corner
// landmarks for a smooth warp instead of a hard trapezoid.
const QUAD_SEGMENTS = 6;

// Resolve the geometric drivers for a layer: rig anchor_points override the
// per-template-type defaults when present and well-formed.
function resolveDrivers(input: EngineLayer): DriverConfig {
  const fallback = DEFAULT_DRIVERS[input.slot];
  const rig = input.rig?.anchor_points;

  if (!rig || rig.version !== 2) return fallback;
  const anchors = rig.anchors ?? {};

  if (fallback.kind === 'quad') {
    // Clothing: corner landmarks stay the template defaults; the rig
    // contributes the UV corners — where this garment's shoulders/hem
    // actually sit on its cutout.
    const uv = (name: string) => {
      const a = anchors[name];
      return a ? { u: a.x, v: 1 - a.y } : null;
    };
    const uvCorners = CLOTHING_UV_ANCHORS.map((name) => uv(name));
    if (uvCorners.every(Boolean)) {
      return { ...fallback, uvCorners: uvCorners as Array<{ u: number; v: number }> };
    }
    return fallback;
  }

  // Rigid: build landmark correspondences from the rig anchors. Side naming
  // is image-side = wearer's right (see ANCHOR_TO_BODY).
  const map = ANCHOR_TO_BODY[input.slot];
  if (!map) return fallback;
  const pairs = Object.entries(map)
    .filter(([name]) => Boolean(anchors[name]))
    .map(([name, lm]) => ({ g: anchors[name], lm }));
  if (pairs.length >= 2) {
    const pinCfg = RIGID_PIN[input.slot];
    const pinAnchor = pinCfg ? anchors[pinCfg.anchor] : undefined;
    return {
      ...fallback,
      pairs,
      pin:
        pinCfg && pinAnchor
          ? { g: pinAnchor, lm: pinCfg.lm, offsetY: pinCfg.offsetY }
          : undefined,
    };
  }
  return fallback;
}

// Build the layer for one garment slot. Resolves null when the texture can't
// be loaded — the caller drops the layer (graceful degradation, never blocks
// the try-on).
export async function createLayer(
  input: EngineLayer,
  scene: THREE.Scene,
  videoWidth: number,
  videoHeight: number
): Promise<ActiveLayer | null> {
  const texture = await loadTexture(input.textureUrl);
  if (!texture) return null;

  // Garment aspect ratio from the image itself (rigid layers preserve it).
  const image = texture.image as HTMLImageElement | undefined;
  const aspect = image ? image.height / image.width : 1;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false,
  });

  const geometry = new THREE.PlaneGeometry(1, 1, QUAD_SEGMENTS, QUAD_SEGMENTS);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = SLOT_RENDER_ORDER[input.slot] ?? 3.5;
  scene.add(mesh);

  // Geometric drivers for this layer: rig anchors when the rig provides
  // them, otherwise the per-template-type defaults.
  const drivers = resolveDrivers(input);

  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
  const uvAttr = geometry.getAttribute('uv') as THREE.BufferAttribute;
  const vertexCount = positionAttr.count;

  // Snapshot the plane's grid coordinates BEFORE any UV rewrite — the warp
  // (applyCorners) interpolates positions by grid u/v, while the uv
  // attribute itself may be remapped to garment-anchor space below.
  const gridU = new Float32Array(vertexCount);
  const gridV = new Float32Array(vertexCount);
  for (let i = 0; i < vertexCount; i++) {
    gridU[i] = uvAttr.getX(i);
    gridV[i] = uvAttr.getY(i);
  }

  // Rig v2 clothing: retexture the quad so this garment's actual
  // shoulder/hem anchor points land on the body's shoulders/hem — the UV
  // corners come from the pipeline anchors, not the image rect.
  if (drivers.uvCorners) {
    const [tl, tr, bl, br] = drivers.uvCorners;
    for (let i = 0; i < vertexCount; i++) {
      const u = uvAttr.getX(i);
      const down = 1 - uvAttr.getY(i);
      const topU = tl.u + (tr.u - tl.u) * u;
      const topV = tl.v + (tr.v - tl.v) * u;
      const botU = bl.u + (br.u - bl.u) * u;
      const botV = bl.v + (br.v - bl.v) * u;
      uvAttr.setXY(i, topU + (botU - topU) * down, topV + (botV - topV) * down);
    }
    uvAttr.needsUpdate = true;
  }

  // Current opacity, lerped toward the visibility-derived target each frame.
  let opacity = 1;

  // Per-frame update, called by the engine's render loop with the current
  // pose landmarks (null when no pose was detected this frame).
  function update(landmarks: NormalizedLandmark[] | null) {
    if (!landmarks) {
      mesh.visible = false;
      return;
    }

    const w = videoWidth;
    const h = videoHeight;

    // Corner positions in raw-frame pixels.
    let corners: THREE.Vector3[] | null = null;
    if (drivers.kind === 'rigid' && drivers.pairs) {
      // Rig-driven similarity: garment anchors ↔ body landmarks measured
      // per product — rotation/scale from correspondences, translation
      // pinned to the template's body reference when one is defined.
      corners = similarityCorners(landmarks, drivers.pairs, w, h, aspect, drivers.pin);
    } else if (drivers.kind === 'quad') {
      const [tl, tr, bl, br] = drivers.quad!;
      const p = (i: number) => (landmarks[i] ? toPixels(landmarks[i]!, w, h) : null);
      const top = [p(tl), p(tr)];
      const bottom = [p(bl), p(br)];
      if (top.every(Boolean) && bottom.every(Boolean)) {
        corners = [
          top[0]!,
          top[1]!,
          ...torsoHips(top as THREE.Vector3[], bottom as THREE.Vector3[]),
        ];
      }
    } else {
      // Rigid: synthesize corners from the anchor midpoint ± half the width
      // reference distance, so both kinds share one transform path.
      const pos = averagePixel(landmarks, drivers.position, w, h);
      const widthPair = drivers.width.map((i) => toPixels(landmarks[i]!, w, h));
      if (pos && widthPair.every(Boolean)) {
        const half = distance(widthPair[0], widthPair[1]) / 2;
        const dir = widthPair[1].clone().sub(widthPair[0]).normalize();
        const center = pos.clone().add(offsetPixels(drivers.offset, w, h));
        const heightVec = new THREE.Vector3(0, half * 2 * aspect, 0);
        corners = [
          center.clone().sub(dir.clone().multiplyScalar(half)),
          center.clone().add(dir.clone().multiplyScalar(half)),
          center.clone().sub(dir.clone().multiplyScalar(half)).add(heightVec),
          center.clone().add(dir.clone().multiplyScalar(half)).add(heightVec),
        ];

      }
    }

    // Fade toward the visibility-derived target (lerp avoids flicker).
    const target = clamp01(
      (avgVisibility(landmarks, driverIndices()) - FADE_OFF) / (FADE_ON - FADE_OFF)
    );
    opacity += (target - opacity) * FADE_LERP;
    material.opacity = opacity;
    mesh.visible = corners !== null && opacity > 0.02;

    if (corners) {
      applyCorners(corners);
    }
  }

  // Project the four corner pixels into the geometry (bilinear interpolation
  // across the subdivided plane — the "smooth warp").
  function applyCorners(c: THREE.Vector3[]) {
    const [tl, tr, bl, br] = c;
    for (let i = 0; i < vertexCount; i++) {
      const u = gridU[i];
      const v = gridV[i];
      const down = 1 - v; // three.js plane UV v=1 at top
      const top = tl.clone().lerp(tr, u);
      const bottom = bl.clone().lerp(br, u);
      const pos = top.lerp(bottom, down);
      positionAttr.setXYZ(i, pos.x, pos.y, 0);
    }
    positionAttr.needsUpdate = true;
    // Keep three.js's frustum-culling bookkeeping valid after every-vertex
    // rewrites.
    geometry.computeBoundingSphere();
  }

  function driverIndices(): number[] {
    return drivers.kind === 'quad'
      ? (drivers.quad as unknown as number[])
      : [...drivers.position, ...drivers.width];
  }

  function dispose() {
    scene.remove(mesh);
    geometry.dispose();
    material.map?.dispose();
    material.dispose();
  }

  return { slot: input.slot, update, dispose };
}
