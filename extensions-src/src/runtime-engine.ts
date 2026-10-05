// The client-side try-on runtime engine — three.js scene + per-frame MediaPipe
// pose detection, replacing the vendor realtime SDK (see the runtime doc:
// rigid items get affine transforms from anchor landmarks; clothing gets
// landmark-driven quads; visibility fades replace broken warps; weak devices
// get pixel-ratio / frame-skip degradation).
//
// Everything runs 100% client-side: the only network calls are the one-time
// model download and the per-product texture fetch. Zero per-frame cost.

import * as THREE from 'three';
import { acquirePoseLandmarker, releasePoseLandmarker } from './pose-model';
import { createLayer, type ActiveLayer } from './engine-layers';
import type { EngineLayer } from './types';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface EngineHandle {
  // Live garment management: replace the full set of active layers (swap
  // without pipeline restart). Slots not in the new list are removed.
  setLayers(layers: EngineLayer[]): Promise<void>;
  // Pause/resume the render loop. Pausing stops rAF entirely (battery), and
  // the pose model stops consuming frames. Used when the person leaves frame.
  setPaused(paused: boolean): void;
  destroy(): void;
}

export interface EngineOptions {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  layers: EngineLayer[];
  // Fires once the first pose frame has been rendered.
  onReady?: () => void;
  onError?: (err: Error) => void;
}

// Sustained frame time that steps quality down; sampled every ~2s.
const DEGRADE_FRAME_MS = 45;
const DEGRADE_CHECK_MS = 2000;

export async function startEngine(options: EngineOptions): Promise<EngineHandle> {
  const { video, canvas } = options;
  if (!video.videoWidth) {
    throw new Error('Engine needs live video dimensions');
  }

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  // Transparent, over the <video>; orthographic camera so normalized
  // landmark coordinates map linearly to scene x/y (z stays free for
  // rotation/occlusion logic later).
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(videoWidth, videoHeight, false);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, videoWidth, 0, videoHeight, -1000, 1000);

    // Pose model — SHARED with person-detection (one GPU landmarker per
  // page; two contend for WebGL and the second returns no landmarks).
  const landmarker = await acquirePoseLandmarker();

  // Layer state — keyed by slot (exactly one layer per slot).
  const activeLayers = new Map<string, ActiveLayer>();
  // Slot → texture URL currently rendered, so setLayers can diff.
  const currentTextures = new Map<string, string>();
  let layersToken = 0; // guards concurrent setLayers swaps

  async function setLayers(layers: EngineLayer[]): Promise<void> {
    const token = ++layersToken;
    const next = new Map(layers.map((l) => [l.slot, l]));

    // Remove layers whose slot vanished or whose texture changed.
    for (const [slot, layer] of activeLayers) {
      const incoming = next.get(slot);
      if (!incoming || incoming.textureUrl !== currentTextures.get(slot)) {
        layer.dispose();
        activeLayers.delete(slot);
        currentTextures.delete(slot);
      }
    }

    // Create layers for new slots/textures.
    for (const [slot, incoming] of next) {
      if (activeLayers.has(slot)) continue;
      const layer = await createLayer(incoming, scene, videoWidth, videoHeight);
      if (token !== layersToken) {
        // A newer swap superseded us — throw away what we created.
        layer?.dispose();
        return;
      }
      if (layer) {
        activeLayers.set(slot, layer);
        currentTextures.set(slot, incoming.textureUrl);
      }
    }
  }

  // Kick off the initial layer load. setLayers resolves once textures are
  // in — errors are per-layer (a failed texture just skips that garment).
  void setLayers(options.layers);

  // Per-frame state.
  let rafId = 0;
  let paused = true; // startEngine leaves the loop stopped until resume
  let readyFired = false;
  let framesRendered = 0;
  let lastVideoTime = -1;
  let latestLandmarks: NormalizedLandmark[] | null = null;
  let frameCounter = 0;
  let detectEveryNFrames = 1;
  let frameTimeEma = 16;
  let lastDegradeCheck = performance.now();

  // Strictly increasing timestamps (MediaPipe requirement) + same-frame skip.
  function detect(): NormalizedLandmark[] | null {
    if (video.readyState < 2) return latestLandmarks;
    const ts = performance.now();
    if (ts <= lastVideoTime) return latestLandmarks;
    lastVideoTime = ts;
    try {
      const result = landmarker.detectForVideo(video, ts);
      latestLandmarks = result.landmarks?.[0] ?? null;
    } catch {
      // A single failed frame (context loss, hidden tab) — keep last pose.
    }
    return latestLandmarks;
  }

  // The render loop: pose detection → layer updates → three.js render.
  // Runs continuously while not paused; the degradation monitor watches the
  // detect+render cost and steps quality down (pixel ratio first, then
  // detection every other frame) on weak devices.
  function loop() {
    rafId = requestAnimationFrame(loop);
    const t0 = performance.now();
    frameCounter += 1;

    let landmarks = latestLandmarks;
    if (frameCounter % detectEveryNFrames === 0) {
      landmarks = detect();
    }

    for (const layer of activeLayers.values()) {
      layer.update(landmarks);
    }
    renderer.render(scene, camera);

    if (!readyFired && (landmarks || ++framesRendered > 90)) {
      // First rendered pose frame — or a ~1.5s grace window: the person
      // gate already passed, so a slow/struggling detector must never
      // strand the modal in 'connecting'.
      readyFired = true;
      options.onReady?.();
    }

    // Degradation monitor (EMA over detect+render cost).
    frameTimeEma = frameTimeEma * 0.9 + (performance.now() - t0) * 0.1;
    if (performance.now() - lastDegradeCheck > DEGRADE_CHECK_MS && frameTimeEma > DEGRADE_FRAME_MS) {
      lastDegradeCheck = performance.now();
      if (renderer.getPixelRatio() > 0.75) {
        renderer.setPixelRatio(0.75);
      } else {
        detectEveryNFrames = 2;
      }
    }
  }

  function startLoop() {
    if (rafId || paused) return;
    rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  return {
    async setLayers(layers: EngineLayer[]): Promise<void> {
      await setLayers(layers);
    },
    // Resume starts the rAF loop; pause stops it entirely (battery).
    setPaused(p: boolean) {
      paused = p;
      if (paused) {
        stopLoop();
      } else {
        startLoop();
      }
    },
    destroy() {
      paused = true;
      stopLoop();
      for (const layer of activeLayers.values()) {
        layer.dispose();
      }
      activeLayers.clear();
      currentTextures.clear();
      // Release the SHARED landmarker (person-detection may still hold it).
      releasePoseLandmarker();
      renderer.dispose();
    },
  };
}
