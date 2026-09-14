// This is the ONLY file that imports the underlying realtime video vendor's
// SDK directly. Isolating it here means:
//   1. The rest of the codebase (TryOnModal, loader, etc.) never references
//      the vendor by name — keeps it out of variable names, comments, and
//      anything easily greppable in the shipped bundle.
//   2. If you ever swap or add a second engine, this is the only file that
//      changes.
//
// Note the real limitation this does NOT solve: a browser-to-vendor WebRTC
// connection still reveals the vendor's domain in the Network tab to anyone
// who opens devtools. There's no way to fully hide that client-side — this
// wrapper only keeps the vendor's name out of your own source and bundle
// strings, not out of the raw network traffic.

import { createDecartClient, models } from '@decartai/sdk';
import { garmentBlobFromUrl } from './garment-image';

export interface EngineConnectOptions {
  // Short-lived, scoped client token minted server-side via
  // client.tokens.create(). NEVER the permanent account API key — that stays
  // on the backend only.
  clientToken: string;
  // e.g. "lucy-vton-latest" — Decart's purpose-built realtime virtual try-on
  // model. Passed from the backend so the model choice can change without a
  // frontend redeploy.
  modelName: string;
  prompt: string;
  // Storefront URL of the garment photo. Realtime sessions take reference
  // images as Blob/URL — a files-API id in initialState KILLS the agent
  // (room joins, then insta-disconnects). So the image is fetched client
  // -side and applied post-connect via setImage, per Decart's docs.
  referenceImageUrl?: string;
  stream: MediaStream;
  onRemoteStream: (stream: MediaStream) => void;
  // Decart connection states: connecting | connected | generating |
  // reconnecting | disconnected. 'generating' means the model is actively
  // producing frames.
  onStateChange?: (state: string) => void;
  onError: (err: Error) => void;
  onDisconnect?: (reason: string) => void;
}

export interface EngineConnection {
  setPrompt: (prompt: string, options?: { enhance?: boolean }) => void;
  disconnect: () => void;
  sessionId: string;
}

const SET_IMAGE_TIMEOUT_MS = 15_000;

export async function connectEngine(opts: EngineConnectOptions): Promise<EngineConnection> {
  const client = createDecartClient({ apiKey: opts.clientToken }); // scoped token, not the account key
  const model = models.realtime(opts.modelName as any);

  // Once the caller calls disconnect(), every forwarded event stops — so the
  // modal never needs `is this still the current connection?` identity
  // checks (which raced: callbacks can fire before connect() resolves and
  // engineRef is assigned, and events fired then were silently dropped).
  let disposed = false;

  // Prompt-only initial state — the garment is attached atomically right
  // after connect via setImage (prompt + image together, per the docs'
  // anti-flicker guidance). Every reconnect runs this same path, so the
  // garment is re-applied on each fresh connection.
  const realtimeClient = await client.realtime.connect(opts.stream, {
    model,
    onRemoteStream: (stream) => {
      if (!disposed) opts.onRemoteStream(stream);
    },
    initialState: {
      prompt: { text: opts.prompt, enhance: false },
    },
  });

  // The SDK's connect options are zod-validated and STRIP unknown keys —
  // error/disconnect callbacks passed above would be silently dropped.
  // Events only arrive through the client's emitter, so they're wired here.
  realtimeClient.on('error', (err: any) => {
    if (disposed) return;
    console.error(
      '[tryon] realtime error:',
      err?.message ?? err,
      err?.code ?? '',
      err?.details ?? ''
    );
    opts.onError(err instanceof Error ? err : new Error(String(err?.message ?? 'Realtime error')));
  });

  realtimeClient.on('connectionChange', (state: string) => {
    if (disposed) return;
    opts.onStateChange?.(state);
    if (state === 'disconnected') {
      opts.onDisconnect?.('connection closed');
    }
  });

  if (opts.referenceImageUrl) {
    const garment = await garmentBlobFromUrl(opts.referenceImageUrl);
    console.log('[tryon] applying garment image', garment ? `${garment.size} bytes` : '(failed to load)');
    if (garment) {
      try {
        await withTimeout(
          realtimeClient.setImage(garment, { prompt: opts.prompt, enhance: false }),
          SET_IMAGE_TIMEOUT_MS,
          'setImage timed out'
        );
        console.log('[tryon] garment applied');
      } catch (err) {
        // Garment rejected/timed out — degrade to prompt-only rather than
        // failing a session that already has a live camera feed.
        console.warn('[tryon] setImage failed — continuing prompt-only', err);
      }
    } else {
      console.warn('[tryon] garment image failed to load — running prompt-only');
    }
  }

  return {
    setPrompt: (prompt, options) => realtimeClient.setPrompt(prompt, options),
    disconnect: () => {
      disposed = true;
      realtimeClient.disconnect();
    },
    sessionId: realtimeClient.sessionId ?? '',
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}
