// This is the ONLY file that imports MediaPipe directly, mirroring how
// runtime-engine.ts is the only file that does the three.js rendering.
//
// Why this exists: the realtime connection is billed from the moment it
// opens — regardless of whether anyone is standing in front of the camera.
// PoseLandmarker runs fully client-side (WASM + WebGL), so we can gate the
// connection on an actually-present person and tear it down when they leave,
// stopping the billing clock.
//
// The WASM runtime and model are fetched from public CDNs at first use,
// pinned to the installed npm version so the two can't drift apart.

import { acquirePoseLandmarker, releasePoseLandmarker } from './pose-model';

// Polling cadence and the consecutive-empty-frame budget before we declare
// the person gone. 3 misses ≈ 3s — short enough to stop billing promptly,
// long enough that a blink or brief occlusion doesn't tear the stream down.
const DETECTION_INTERVAL_MS = 1000;
const MISS_THRESHOLD = 3;

export interface PersonDetection {
  stop: () => void;
}

export async function startPersonDetection(
  video: HTMLVideoElement,
  callbacks: { onPresent: () => void; onAbsent: () => void }
): Promise<PersonDetection> {
  // GPU→CPU fallback and URL pinning live in the shared factory. The
  // instance is SHARED with the runtime engine (one GPU landmarker per
  // page — two contend for WebGL and the second returns no landmarks), so
  // stop() releases rather than closes it.
  const landmarker = await acquirePoseLandmarker();

  let present = false;
  let misses = 0;
  let lastVideoTime = -1;
  let stopped = false;

  const detect = () => {
    if (stopped || !landmarker || video.readyState < 2) return;

    try {
      // MediaPipe requires strictly increasing timestamps per video element.
      const ts = performance.now();
      if (ts <= lastVideoTime) return;
      lastVideoTime = ts;

      const result = landmarker.detectForVideo(video, ts);
      if (result.landmarks.length > 0) {
        misses = 0;
        if (!present) {
          present = true;
          callbacks.onPresent();
        }
      } else if (present) {
        misses += 1;
        if (misses >= MISS_THRESHOLD) {
          present = false;
          callbacks.onAbsent();
        }
      }
    } catch {
      // A single failed frame (context loss, hidden tab) is neither a miss
      // nor a hit — skip it and let the next tick decide.
    }
  };

  const interval = window.setInterval(detect, DETECTION_INTERVAL_MS);

  return {
    stop: () => {
      stopped = true;
      window.clearInterval(interval);
      // Release the SHARED landmarker (the engine may still be using it).
      releasePoseLandmarker();
    },
  };
}
