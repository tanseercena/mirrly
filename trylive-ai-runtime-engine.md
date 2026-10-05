# Trylive AI — Runtime Try-On Engine (Client-Side, three.js)

**Status:** Planning doc — companion to `trylive-ai-tryon-architecture.md`
**Scope:** The client-side rendering engine (Subsystem C) that takes rigged garment
assets (produced by the offline ingestion pipeline) and overlays them live on a
customer's webcam feed. 100% client-side — zero server round-trips per frame.

---

## Why three.js over Canvas 2D / PixiJS

| Library | What it is | Limitation for this use case |
|---|---|---|
| Canvas 2D | Browser-native, no library | Fine for rigid items only; no depth/rotation handling |
| PixiJS | 2D WebGL engine | Fast flat mesh-warp, but no concept of depth — can't handle out-of-plane rotation or self-occlusion |
| **three.js** | 3D WebGL engine | Chosen: can represent garments as lightweight 3D proxies, giving foreshortening and self-occlusion "for free" via the depth buffer when a user turns |

The deciding factor is the **turning problem**: a flat 2D mesh warp only handles
in-plane movement well (up/down, side-to-side, arms raising). It breaks down when
a user rotates — foreshortening isn't applied, and parts of the garment that should
be occluded (far side of a jacket as the body turns) keep rendering, producing the
classic "pasted-on sticker" look. Modeling garments as low-poly 3D proxies and
driving them with MediaPipe's per-landmark z-coordinate solves both problems using
three.js's native depth handling, without hand-written occlusion logic.

---

## High-level stages

```
1. Widget Init        → load models, set up scene
2. Session Start       → camera permission, stream acquisition
3. Per-Frame Loop       → pose + face detection → apply to proxies → render
4. Garment Management   → add/remove/swap layers
5. Degradation Handling → confidence drops, weak devices
```

---

## 1. Widget Init (once, on page load)

- **Load pose model** — MediaPipe Pose/BlazePose (Tasks Vision API or TF.js build).
  Shared across all merchants, cached at CDN edge. Returns per-landmark x/y/z
  (z = rough relative depth, used for rotation/occlusion).
- **Load Face Mesh model** — loaded lazily, only the first time a glasses item is
  activated. Not loaded for customers only trying on clothing.
- **Set up three.js scene**, once:
  - `WebGLRenderer`, sized to the video element's dimensions, `alpha: true`
    (transparent background) so it composites over the live camera feed beneath it.
  - **Orthographic camera** (not perspective) — landmark coordinates from the pose
    model map directly to scene x/y without perspective distortion; z is still used
    internally for rotation/occlusion logic.
  - Empty `Scene`. `MeshBasicMaterial` (flat-shaded/texture-only) is enough — no
    lights required unless garments should respond to shading later.
- **DOM layout:** a `<video>` element (live camera, muted, no controls) with the
  three.js `<canvas>` absolutely positioned directly on top, same dimensions,
  1:1 pixel alignment.

---

## 2. Session Start (when customer opens try-on)

- `getUserMedia({ video: true })` → stream assigned to the `<video>` element.
- Wait for the `loadedmetadata` event to get actual video dimensions → resize
  canvas/renderer to match (avoids coordinate drift between landmark space and
  render space).
- Start the per-frame loop via `requestAnimationFrame`.

---

## 3. Per-Frame Loop

```js
function renderLoop() {
  const pose = poseModel.detectForVideo(video, timestamp);

  let face = null;
  if (hasActiveRigidFaceItem) {
    face = faceMeshModel.detectForVideo(video, timestamp);
  }

  for (const layer of activeLayers) {
    if (layer.kind === 'rigid') {
      updateRigid(layer, face ?? pose);
    } else {
      updateDeformable(layer, pose);
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
}
```

### 3a. Rigid items (glasses, cap, bag, necklace)

Simple three.js `PlaneGeometry`/sprite per item, in the same scene as the
deformable layers — no separate render context needed. Transform updated per
frame via a single affine computation (translate + rotate + scale), no mesh
deformation required:

```js
function updateRigid(layer, landmarks) {
  const anchor = landmarks[layer.anchorIndex];       // e.g. nose bridge
  const angle = computeAngleFromLandmarks(landmarks, layer.angleRefPoints);  // e.g. eye-to-eye
  const scale = computeScaleFromLandmarks(landmarks, layer.scaleRefPoints); // e.g. eye distance

  layer.mesh.position.set(anchor.x, anchor.y, anchor.z);
  layer.mesh.rotation.z = angle;
  layer.mesh.scale.setScalar(scale * layer.baseScale);
}
```

### 3b. Deformable clothing (top, jacket, dress, pants, shorts, skirt)

Each garment template is rigged offline as a low-poly 3D proxy — a handful of
connected panels (e.g. torso + two sleeve panels for a top) with the garment
cutout texture UV-mapped across them. At runtime, each proxy vertex is driven by
its tagged pose landmark:

```js
function updateDeformable(layer, poseLandmarks) {
  // Each proxy vertex is tagged at rig-time with which pose landmark drives it
  for (const vertex of layer.proxy.vertices) {
    const landmark = poseLandmarks[vertex.drivingLandmarkIndex];
    vertex.position.set(landmark.x, landmark.y, landmark.z); // z drives rotation/foreshortening
  }
  layer.proxy.geometry.attributes.position.needsUpdate = true; // tells three.js to re-upload to GPU

  // Occlusion: hide a panel if its driving landmarks indicate it's facing away
  layer.proxy.panels.forEach(panel => {
    panel.visible = panel.facingScore(poseLandmarks) > OCCLUSION_THRESHOLD;
  });
}
```

- The shoulder-z delta (left-shoulder-z vs right-shoulder-z) is the core rotation
  signal — feeds `facingScore`, which drives panel visibility.
- `needsUpdate = true` on the `BufferGeometry` position attribute is the standard
  three.js signal that vertex data changed and must be re-uploaded to the GPU
  that frame.

---

## 4. Garment Management (layering, swapping)

- Each active item is one object in a `layers` map, keyed by slot (`top`,
  `bottom`, `headwear`, `eyewear`, etc.) — exactly one item per slot active at a
  time, multiple slots simultaneously.
- **Swap:** replace the texture + proxy mesh for that slot's layer object; nothing
  else in the loop changes. No pipeline restart — stays live through the swap.
- **Add/remove:** `scene.add()` / `scene.remove()`, push/remove from
  `activeLayers`.
- **Z-ordering between slots** (bottoms behind top, top behind jacket, accessories
  on top of everything): explicit render-order groups per slot type — simpler to
  reason about than relying on depth sorting across very different garment types.

---

## 5. Degradation Handling

- **Low pose/face confidence** (deep profile turn, poor lighting, occluded
  landmark): fade the affected layer's opacity toward 0 rather than render a
  broken/stretched warp; restore as confidence recovers. Lerp over a few frames
  to avoid flicker.
- **Weak device / low frame rate:** detect via `requestAnimationFrame` delta
  time. If consistently below target: drop renderer pixel ratio
  (`renderer.setPixelRatio`) and/or skip pose detection every other frame
  (reuse last frame's landmarks) before reducing visual quality further.
- **Model load failure / no camera permission:** widget falls back to a static
  "try it on" product image state — no crash, no blank canvas.

---

## Network cost summary

Everything above is 100% client-side, zero server round-trips per frame. The only
network calls in the whole runtime flow are:
1. One-time model downloads (pose model, face mesh model) — cached by browser/CDN
   after first load.
2. Per-product rig JSON + texture fetch, only when a layer is first activated.

This is the structural cost win carried through from dropping the Decart
real-time-video-generation approach: per-customer-session cost is effectively
zero, regardless of session length or concurrency.

---

## Open items

- [ ] Define the exact proxy-rigging data format the offline pipeline must output
      per garment (panel count, vertex-to-landmark mapping, UV layout) so this
      runtime code can consume it directly.
- [ ] Confirm pose model variant includes z-coordinates and foot/ankle landmarks;
      confirm Face Mesh model choice/size for lazy-loading.
- [ ] Decide `OCCLUSION_THRESHOLD` and confidence-fade thresholds empirically,
      once real garment proxies exist to test against.
- [ ] Define render-order group constants per slot type.
