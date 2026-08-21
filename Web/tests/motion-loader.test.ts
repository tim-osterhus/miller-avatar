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

test("loadMotion falls back to the first authored planar sample when rest hips are unavailable", async () => {
  const sourceValues = [
    0.1, 0.9, -0.2,
    0.2, 1.1, 0.1,
    0.4, 1.3, 0.4,
  ];
  const source = new THREE.AnimationClip("linear", 1, [
    new THREE.VectorKeyframeTrack("hips.position", [0, 0.5, 1], sourceValues),
  ]);
  const sourceSnapshot = Array.from(source.tracks[0]!.values);
  const dependencies = fakeDependencies({
    parsedAnimations: [{}],
    createClip() { return source; },
  });

  const result = await loadMotion(input(), fakeAvatar({ includeRestHips: false }), new AbortController().signal, dependencies);
  const steady = (result as unknown as { steadyClip?: THREE.AnimationClip }).steadyClip;
  assert.ok(steady);
  assert.deepEqual(Array.from(source.tracks[0]!.values), sourceSnapshot);
  assert.deepEqual(Array.from(steady.tracks[0]!.times), Array.from(new Float32Array([0, 0.5, 1])));
  assert.deepEqual(Array.from(steady.tracks[0]!.values), Array.from(new Float32Array([
    0.1, 0.9, -0.2,
    0.1, 1.1, -0.2,
    0.1, 1.3, -0.2,
  ])));
});

test("loadMotion preserves cubic steady Y data and falls back to the first authored planar sample without rest hips", async () => {
  const sourceValues = [
    1, 0.5, 2, 0.25, 0.5, -0.75, 3, 0.6, -4,
    4, 1.5, 5, -2, 0.75, 1.25, 6, 0.8, 7,
  ];
  const track = new THREE.VectorKeyframeTrack("hips.position", [0, 1], sourceValues);
  const cubicInterpolant = (() => ({})) as typeof track.createInterpolant;
  cubicInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
  track.createInterpolant = cubicInterpolant;
  const source = new THREE.AnimationClip("cubic", 1, [track]);
  const sourceSnapshot = Array.from(track.values);
  const dependencies = fakeDependencies({
    parsedAnimations: [{}],
    createClip() { return source; },
  });

  const result = await loadMotion(input(), fakeAvatar({ includeRestHips: false }), new AbortController().signal, dependencies);
  const steady = (result as unknown as { steadyClip?: THREE.AnimationClip }).steadyClip;
  assert.ok(steady);
  assert.deepEqual(Array.from(source.tracks[0]!.values), sourceSnapshot);
  assert.deepEqual(Array.from(steady.tracks[0]!.values), Array.from(new Float32Array([
    0, 0.5, 0, 0.25, 0.5, -0.75, 0, 0.6, 0,
    0, 1.5, 0, 0.25, 0.75, -0.75, 0, 0.8, 0,
  ])));
  assert.equal(steady.tracks[0]!.createInterpolant, cubicInterpolant);
});

test("loadMotion anchors steady planar centers to finite normalized rest hips", async () => {
  const linearSource = new THREE.AnimationClip("linear-rest-anchor", 1, [
    new THREE.VectorKeyframeTrack("hips.position", [0, 1], [2, 0.9, -3, 4, 1.1, 5]),
  ]);
  const linearSnapshot = Array.from(linearSource.tracks[0]!.values);
  const linearResult = await loadMotion(
    input(),
    fakeAvatar({ restHips: [7, 2, 8] }),
    new AbortController().signal,
    fakeDependencies({ parsedAnimations: [{}], createClip() { return linearSource; } }),
  );
  const linearSteady = linearResult.steadyClip;
  assert.ok(linearSteady);
  assert.deepEqual(Array.from(linearSource.tracks[0]!.values), linearSnapshot);
  assert.deepEqual(Array.from(linearSteady.tracks[0]!.values), Array.from(new Float32Array([
    7, 0.9, 8,
    7, 1.1, 8,
  ])));

  const cubicTrack = new THREE.VectorKeyframeTrack("hips.position", [0, 1], [
    1, 0.1, 2, 2, 0.5, -3, 3, 0.6, 4,
    4, 0.3, 5, 6, 0.75, 7, 8, 0.9, 9,
  ]);
  const cubicInterpolant = (() => ({})) as typeof cubicTrack.createInterpolant;
  cubicInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
  cubicTrack.createInterpolant = cubicInterpolant;
  const cubicSource = new THREE.AnimationClip("cubic-rest-anchor", 1, [cubicTrack]);
  const cubicSnapshot = Array.from(cubicTrack.values);
  const cubicResult = await loadMotion(
    input(),
    fakeAvatar({ restHips: [7, 2, 8] }),
    new AbortController().signal,
    fakeDependencies({ parsedAnimations: [{}], createClip() { return cubicSource; } }),
  );
  const cubicSteady = cubicResult.steadyClip;
  assert.ok(cubicSteady);
  assert.deepEqual(Array.from(cubicTrack.values), cubicSnapshot);
  assert.deepEqual(Array.from(cubicSteady.tracks[0]!.values), Array.from(new Float32Array([
    0, 0.1, 0, 7, 0.5, 8, 0, 0.6, 0,
    0, 0.3, 0, 7, 0.75, 8, 0, 0.9, 0,
  ])));
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

function fakeAvatar(options: {
  includeRestHips?: boolean;
  restHips?: [number, number, number];
  boneNames?: string[];
} = {}) {
  const hips = options.includeRestHips === false
    ? undefined
    : { position: options.restHips ?? [1, 2, 3] };
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
