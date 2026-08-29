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

export interface EngineConnectOptions {
  // Short-lived, scoped client token minted server-side via
  // client.tokens.create({ expiresIn, allowedModels, allowedOrigins }).
  // NEVER the permanent account API key — that stays on the backend only.
  clientToken: string;
  // e.g. "lucy-vton-3.5" — Decart's purpose-built realtime virtual try-on
  // model, not the general-purpose editing model. Passed from the backend
  // so the model choice can change without a frontend redeploy.
  modelName: string;
  prompt: string;
  // A file_… id from client.files.upload(), NOT a raw image URL. Uploading
  // requires the real API key, so this must be done server-side during the
  // /session call and handed to the browser as an id, already resolved.
  referenceImageFileId?: string;
  stream: MediaStream;
  onRemoteStream: (stream: MediaStream) => void;
  onError: (err: Error) => void;
  onDisconnect?: (reason: string) => void;
}

export interface EngineConnection {
  setPrompt: (prompt: string, options?: { enhance?: boolean }) => void;
  disconnect: () => void;
  sessionId: string;
}

export async function connectEngine(opts: EngineConnectOptions): Promise<EngineConnection> {
  const client = createDecartClient({ apiKey: opts.clientToken }); // scoped token, not the account key
  const model = models.realtime(opts.modelName as any);

  const realtimeClient = await client.realtime.connect(opts.stream, {
    model,
    onRemoteStream: opts.onRemoteStream,
    onError: opts.onError,
    onDisconnect: opts.onDisconnect,
    initialState: {
      prompt: { text: opts.prompt, enhance: true },
      ...(opts.referenceImageFileId ? { image: opts.referenceImageFileId } : {}),
    },
  });

  return {
    setPrompt: (prompt, options) => realtimeClient.setPrompt(prompt, options),
    disconnect: () => realtimeClient.disconnect(),
    sessionId: realtimeClient.sessionId,
  };
}
