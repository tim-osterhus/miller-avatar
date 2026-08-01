import type { FrameScheduler } from "./bridge.js";
import { ThreeVRMRendererBackend } from "./renderer.js";
import { startBrowserRenderer, type BrowserRendererReceiver } from "./runtime.js";

export function startBrowserRuntime() {
  const root = globalThis.document.getElementById("avatar");
  if (!(root instanceof HTMLElement)) throw new Error("missing renderer root");
  return startBrowserRenderer({
    entryURL: globalThis.location.href,
    backend: new ThreeVRMRendererBackend(root),
    scheduler: browserFrameScheduler,
    postObservation(message) {
      const handler = webkitObservationHandler();
      if (!handler) throw new Error("missing observation transport");
      handler.postMessage(message);
    },
    installReceiver,
  });
}

function installReceiver(receiver: BrowserRendererReceiver): void {
  if ("millerAvatarBridge" in globalThis) throw new Error("bridge receiver already installed");
  Object.defineProperty(globalThis, "millerAvatarBridge", {
    value: Object.freeze(receiver),
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

type WebKitObservationHandler = { postMessage(message: string): void };

function webkitObservationHandler(): WebKitObservationHandler | undefined {
  const webkit = (globalThis as typeof globalThis & {
    webkit?: { messageHandlers?: { millerAvatarObservation?: WebKitObservationHandler } };
  }).webkit;
  return webkit?.messageHandlers?.millerAvatarObservation;
}

const browserFrameScheduler: FrameScheduler = {
  request(callback) {
    return globalThis.requestAnimationFrame(callback);
  },
  cancel(handle) {
    globalThis.cancelAnimationFrame(handle);
  },
};
