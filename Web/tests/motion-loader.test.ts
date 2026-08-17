import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import {
  loadMotion,
  type MotionLoaderDependencies,
  type UniqueMotionInput,
} from "../src/motion-loader.js";

const token = "33333333-3333-4333-8333-333333333333";

test("loadMotion registers the VRMA plugin, requires exactly one parsed animation, and converts for the target avatar", async () => {
  const calls: string[] = [];
  const clip = new THREE.AnimationClip("converted", 1, [track("hips.position", [1, 2, 3, 1, 2, 3])]);
  const avatar = fakeAvatar();
  const dependencies = fakeDependencies({
    parsedAnimations: [{}],
    createClip(animation, target) {
      calls.push(`clip:${animation === undefined}:${target === avatar}`);
      return clip;
    },
  });

  const result = await loadMotion(input(), avatar, new AbortController().signal, dependencies);

  assert.equal(result.motionToken, token);
  assert.equal(result.clip, clip);
  assert.deepEqual(calls, ["clip:false:true"]);
  assert.deepEqual(dependencies.events, ["create_loader", "register"]);
});

test("loadMotion rejects absent and multiple animations", async () => {
  for (const parsedAnimations of [[], [{}, {}]]) {
    await assert.rejects(
      loadMotion(input(), fakeAvatar(), new AbortController().signal, fakeDependencies({ parsedAnimations })),
      /exactly one VRMA animation/,
    );
  }
});

test("loadMotion rejects non-1.0 documents, missing default scenes, and external URI members", async () => {
  const draft = validParser();
  draft.json.extensions.VRMC_vrm_animation.specVersion = "1.0-draft";
  await assert.rejects(
    loadMotion(input(), fakeAvatar(), new AbortController().signal, fakeDependencies({ parsedAnimations: [{}], parser: draft })),
    /version 1.0/,
  );

  const missingScene = validParser();
  delete missingScene.json.scene;
  await assert.rejects(
    loadMotion(input(), fakeAvatar(), new AbortController().signal, fakeDependencies({ parsedAnimations: [{}], parser: missingScene })),
    /default scene/,
  );

  const external = validParser();
  external.json.buffers[0]!.uri = "motion.vrma";
  await assert.rejects(
    loadMotion(input(), fakeAvatar(), new AbortController().signal, fakeDependencies({ parsedAnimations: [{}], parser: external })),
    /external URI/,
  );
});

test("loadMotion classifies the bounded ten-second timeout", async () => {
  const scheduler = new ManualTimeoutScheduler();
  const dependencies = fakeDependencies({
    parsedAnimations: [{}],
    load() {
      // Keep the injected loader pending until the timeout scheduler fires.
    },
  });
  dependencies.timeoutMilliseconds = 10;
  dependencies.timeoutScheduler = scheduler;
  const pending = loadMotion(input(), fakeAvatar(), new AbortController().signal, dependencies);
  scheduler.run();
  await assert.rejects(pending, (error: unknown) => (
    error instanceof Error
      && (error as Error & { code?: string }).code === "motion_load_timeout"
  ));
});

test("loadMotion aborts before parsing and disposes a result detached after parsing", async () => {
  const before = new AbortController();
  before.abort();
  let disposed = 0;
  const dependencies = fakeDependencies({
    parsedAnimations: [{}],
    disposeClip() { disposed += 1; },
  });
  await assert.rejects(loadMotion(input(), fakeAvatar(), before.signal, dependencies), { name: "AbortError" });
  assert.deepEqual(dependencies.events, []);

  const after = new AbortController();
  const late = fakeDependencies({
    parsedAnimations: [{}],
    createClip() {
      const lateClip = new THREE.AnimationClip("late", 1, []);
      after.abort();
      return lateClip;
    },
    disposeClip() { disposed += 1; },
  });
  await assert.rejects(loadMotion(input(), fakeAvatar(), after.signal, late), { name: "AbortError" });
  assert.equal(disposed, 1);
});

test("loadMotion classifies stale identity without emitting a result", async () => {
  const dependencies = fakeDependencies({ parsedAnimations: [{}] });
  await assert.rejects(
    loadMotion({ ...input(), isCurrent: () => false }, fakeAvatar(), new AbortController().signal, dependencies),
    { name: "AbortError" },
  );
});

test("loadMotion filters expression and look-at tracks without changing converted hips translation", async () => {
  const tracks = [
    track("hips.position", [2, 3, 4, 4, 5, 6]),
    track("head.quaternion", [0, 0, 0, 1]),
    track("expressions.mouth", [0]),
    track("lookAt.quaternion", [0, 0, 0, 1]),
  ];
  const dependencies = fakeDependencies({
    parsedAnimations: [{}],
    createClip() { return new THREE.AnimationClip("converted", 1, tracks); },
  });
  const result = await loadMotion(input(), fakeAvatar(), new AbortController().signal, dependencies);

  assert.deepEqual(result.clip.tracks.map((entry) => entry.name), ["hips.position", "head.quaternion"]);
  assert.deepEqual(Array.from(result.clip.tracks[0]!.values), [2, 3, 4, 4, 5, 6]);
});

test("loadMotion rejects a generated clip with no skeletal tracks and validates target bone names before conversion", async () => {
  await assert.rejects(
    loadMotion(input(), fakeAvatar(), new AbortController().signal, fakeDependencies({
      parsedAnimations: [{}],
      createClip() {
        return new THREE.AnimationClip("expression-only", 1, [track("expressions.mouth", [0, 0])]);
      },
    })),
    /no usable humanoid tracks/,
  );

  for (const boneNames of [["", "head"], ["same", "same"]]) {
    await assert.rejects(
      loadMotion(input(), fakeAvatar({ boneNames }), new AbortController().signal, fakeDependencies({ parsedAnimations: [{}] })),
      /normalized humanoid bone names|normalized humanoid bone name is empty/,
    );
  }
});

test("loadMotion rejects non-finite samples introduced during target conversion", async () => {
  await assert.rejects(
    loadMotion(input(), fakeAvatar(), new AbortController().signal, fakeDependencies({
      parsedAnimations: [{}],
      createClip() {
        return new THREE.AnimationClip("non-finite", 1, [
          track("hips.position", [0, 1, 2, 3, Number.POSITIVE_INFINITY, 5]),
        ]);
      },
    })),
    /finite/,
  );
});

test("loadMotion preserves cubic-spline hips values and does not require a normalized-rest hips position", async () => {
  const tracks = [track("hips.position", [9, 8, 7, 2, 3, 4, 12, 11, 10, 5, 6, 7, 13, 14, 15, 8, 9, 10])];
  const dependencies = fakeDependencies({
    parsedAnimations: [{}],
    createClip() {
      const clip = new THREE.AnimationClip("converted", 1, tracks);
      const cubicInterpolant = (() => ({})) as typeof tracks[0]["createInterpolant"];
      cubicInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
      tracks[0]!.createInterpolant = cubicInterpolant;
      return clip;
    },
  });
  const result = await loadMotion(input(), fakeAvatar({ includeRestHips: false }), new AbortController().signal, dependencies);
  assert.deepEqual(
    Array.from(result.clip.tracks[0]!.values),
    [9, 8, 7, 2, 3, 4, 12, 11, 10, 5, 6, 7, 13, 14, 15, 8, 9, 10],
  );
});

function input(overrides: Partial<UniqueMotionInput> = {}): UniqueMotionInput {
  return {
    sessionID: "11111111-1111-4111-8111-111111111111",
    generationID: "22222222-2222-4222-8222-222222222222",
    profileRevision: 1,
    motionToken: token,
    url: `miller-avatar-local://app/session/11111111-1111-4111-8111-111111111111/${token}.vrma`,
    ...overrides,
  };
}

function fakeDependencies(options: {
  parsedAnimations: unknown[];
  parser?: ReturnType<typeof validParser>;
  createClip?: (animation: unknown, avatar: unknown) => THREE.AnimationClip;
  disposeClip?: (clip: THREE.AnimationClip) => void;
  load?: (onLoad: (gltf: unknown) => void, onError: (error: unknown) => void) => void;
}): MotionLoaderDependencies & { events: string[] } {
  const events: string[] = [];
  return {
    events,
    createLoader() {
      events.push("create_loader");
      return {
        register() { events.push("register"); },
        load(_url, onLoad, _progress, onError) {
          if (options.load) {
            options.load(onLoad, onError);
            return;
          }
          onLoad({ parser: options.parser ?? validParser(), userData: { vrmAnimations: options.parsedAnimations } });
        },
      };
    },
    createPlugin() { return {}; },
    createClip: options.createClip ?? (() => new THREE.AnimationClip("converted", 1, [])),
    disposeClip: options.disposeClip,
  };
}

class ManualTimeoutScheduler {
  private next = 1;
  private callbacks = new Map<number, () => void>();

  request(callback: () => void): number {
    const handle = this.next++;
    this.callbacks.set(handle, callback);
    return handle;
  }

  cancel(handle: number): void {
    this.callbacks.delete(handle);
  }

  run(): void {
    const entry = this.callbacks.entries().next().value as [number, () => void] | undefined;
    if (!entry) throw new Error("no timeout pending");
    this.callbacks.delete(entry[0]);
    entry[1]();
  }
}

function validParser() {
  return {
    json: {
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: "root" }],
      animations: [{}],
      buffers: [{ byteLength: 0 }],
      extensions: { VRMC_vrm_animation: { specVersion: "1.0", humanoid: { hips: 0 } } },
    },
  };
}

function fakeAvatar(options: { includeRestHips?: boolean; boneNames?: string[] } = {}) {
  const hips = options.includeRestHips === false
    ? undefined
    : { position: [1, 2, 3] };
  const boneNames = options.boneNames ?? ["hips", "head"];
  return {
    humanoid: {
      normalizedRestPose: hips === undefined ? {} : { hips },
      normalizedHumanBones: Object.fromEntries(boneNames.map((name, index) => [
        index === 0 ? "hips" : `bone${index}`,
        { node: { name } },
      ])),
    },
  } as never;
}

function track(name: string, values: number[]): THREE.KeyframeTrack {
  return new THREE.VectorKeyframeTrack(name, [0, 1], values);
}
