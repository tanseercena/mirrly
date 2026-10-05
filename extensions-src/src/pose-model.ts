// Shared MediaPipe PoseLandmarker factory. Both consumers need the exact
// same model: person-detection.ts (1s presence polling, the gate) and
// runtime-engine.ts (per-frame landmarks each frame) and the browser then
// downloads the model + wasm once — the second consumer hits the HTTP cache.
//
// The WASM runtime and model are fetched from public CDNs at first use,
// pinned to the installed npm version so the two consumers can't drift apart.

import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export async function createPoseLandmarker(): Promise<PoseLandmarker> {
  const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
  try {
    return await PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numPoses: 1,
    });
  } catch {
    // GPU delegate unavailable (driver/blocked WebGL) — CPU still works,
    // just slower. Fine for the 1s presence poll; the runtime engine's
    // degradation handling absorbs the lower frame rate.
    return await PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
      runningMode: 'VIDEO',
      numPoses: 1,
    });
  }
}

// --- shared instance ---
//
// Two GPU-backed landmarkers on the same <video> contend for WebGL and the
// second one can silently return no landmarks — which stranded the modal in
// 'connecting' (the engine's onReady never fired). So person-detection and
// the runtime engine share ONE instance, refcounted: it's created on first
// acquire and closed when the last holder releases.

let shared: PoseLandmarker | null = null;
let refCount = 0;
let creating: Promise<PoseLandmarker> | null = null;

export async function acquirePoseLandmarker(): Promise<PoseLandmarker> {
  refCount += 1;
  if (shared) return shared;
  if (!creating) {
    creating = createPoseLandmarker().then((landmarker) => {
      shared = landmarker;
      creating = null;
      return landmarker;
    });
  }
  return creating;
}

export function releasePoseLandmarker(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && shared) {
    shared.close();
    shared = null;
  }
}
