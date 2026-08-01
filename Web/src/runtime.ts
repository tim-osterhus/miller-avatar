import {
  WebRendererCore,
  type FrameScheduler,
  type RendererBackend,
} from "./bridge.js";

const sessionPath = /^\/session\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/bundle\/index\.html$/u;

export interface BrowserRendererReceiver {
  accept(commandJSON: string): Promise<void>;
}

export interface BrowserRendererDependencies {
  entryURL: string;
  backend: RendererBackend;
  scheduler: FrameScheduler;
  postObservation(message: string): void;
  installReceiver(receiver: BrowserRendererReceiver): void;
}

export function startBrowserRenderer(
  dependencies: BrowserRendererDependencies,
): WebRendererCore {
  const core = new WebRendererCore(
    sessionIDFromEntryURL(dependencies.entryURL),
    dependencies.backend,
    dependencies.scheduler,
    dependencies.postObservation,
  );
  dependencies.installReceiver({
    accept(commandJSON) {
      return core.accept(commandJSON);
    },
  });
  core.start();
  return core;
}

export function sessionIDFromEntryURL(rawURL: string): string {
  const url = new URL(rawURL);
  const match = sessionPath.exec(url.pathname);
  if (
    url.protocol !== "miller-avatar-local:"
    || url.hostname !== "app"
    || url.username !== ""
    || url.password !== ""
    || url.port !== ""
    || url.search !== ""
    || url.hash !== ""
    || match === null
    || match[1] !== match[1]?.toLowerCase()
  ) {
    throw new Error("invalid renderer entry URL");
  }
  return match[1];
}
