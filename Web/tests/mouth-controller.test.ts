import assert from "node:assert/strict";
import test from "node:test";
import {
  MouthController,
  mapMouthTarget,
  type MouthCapabilities,
  type MouthTarget,
  type MouthVowelWeights,
} from "../src/mouth-controller.js";

const allVowels: MouthCapabilities = Object.freeze({
  aa: true,
  ih: true,
  ou: true,
  ee: true,
  oh: true,
});

const zeroWeights: MouthVowelWeights = Object.freeze({
  aa: 0,
  ih: 0,
  ou: 0,
  ee: 0,
  oh: 0,
});

function enriched(scalar: number, vowels: MouthVowelWeights): MouthTarget {
  return { scalar, vowels };
}

test("MouthController uses the attack rate for a rising scalar-only target", () => {
  const controller = new MouthController(allVowels);

  assert.deepEqual(controller.update({ scalar: 1 }), {
    aa: 0.55,
    ih: 0,
    ou: 0,
    ee: 0,
    oh: 0,
  });
});

test("MouthController uses the release rate for a falling target", () => {
  const controller = new MouthController(allVowels);
  controller.update({ scalar: 1 });

  assert.deepEqual(controller.update({ scalar: 0 }), {
    aa: 0.385,
    ih: 0,
    ou: 0,
    ee: 0,
    oh: 0,
  });
});

test("MouthController zeros values below the smoothing threshold", () => {
  const controller = new MouthController(allVowels);

  assert.deepEqual(controller.update({ scalar: 0.0015 }), zeroWeights);
});

test("mapMouthTarget preserves deterministic five-vowel mapping for an all-vowel model", () => {
  const vowels = { aa: 0.1, ih: 0.2, ou: 0.3, ee: 0.4, oh: 0.5 } as const;

  assert.deepEqual(mapMouthTarget(enriched(0.9, vowels), allVowels), vowels);
});

test("mapMouthTarget folds unavailable weights into aa and clamps aa", () => {
  const capabilities: MouthCapabilities = {
    aa: true,
    ih: false,
    ou: true,
    ee: false,
    oh: false,
  };
  const target = enriched(0.2, { aa: 0.8, ih: 0.8, ou: 0.3, ee: 0.4, oh: 0.5 });

  assert.deepEqual(mapMouthTarget(target, capabilities), {
    aa: 1,
    ih: 0,
    ou: 0.3,
    ee: 0,
    oh: 0,
  });
});

test("partial models without aa apply supported vowels and ignore unsupported weight", () => {
  const capabilities: MouthCapabilities = {
    aa: false,
    ih: true,
    ou: false,
    ee: false,
    oh: true,
  };
  const target = enriched(0.95, { aa: 0.9, ih: 0.4, ou: 0.8, ee: 0.7, oh: 0.2 });
  const controller = new MouthController(capabilities);

  assert.deepEqual(mapMouthTarget(target, capabilities), {
    aa: 0,
    ih: 0.4,
    ou: 0,
    ee: 0,
    oh: 0.2,
  });
  assert.deepEqual(controller.update(target), {
    aa: 0,
    ih: 0.4 * 0.55,
    ou: 0,
    ee: 0,
    oh: 0.2 * 0.55,
  });
});

test("scalar-only targets use aa", () => {
  const controller = new MouthController(allVowels);

  assert.deepEqual(controller.update({ scalar: 0.8 }), {
    aa: 0.44000000000000006,
    ih: 0,
    ou: 0,
    ee: 0,
    oh: 0,
  });
});

test("enriched targets do not apply scalar again to aa", () => {
  const controller = new MouthController(allVowels);
  const target = enriched(1, { aa: 0, ih: 1, ou: 0, ee: 0, oh: 0 });

  assert.deepEqual(controller.update(target), {
    aa: 0,
    ih: 0.55,
    ou: 0,
    ee: 0,
    oh: 0,
  });
});

test("MouthController clear returns all five outputs to zero and resets state", () => {
  const controller = new MouthController(allVowels);
  controller.update({ scalar: 1 });

  assert.deepEqual(controller.clear(), zeroWeights);
  assert.deepEqual(controller.update({ scalar: 1 }), {
    aa: 0.55,
    ih: 0,
    ou: 0,
    ee: 0,
    oh: 0,
  });
});

test("MouthController copies inputs and freezes its output", () => {
  const vowels = { aa: 0.6, ih: 0.2, ou: 0, ee: 0, oh: 0 };
  const target = enriched(0.1, vowels);
  const controller = new MouthController(allVowels);
  const output = controller.update(target);

  vowels.aa = 0;
  target.scalar = 1;
  assert.equal(output.aa, 0.33);
  assert.notStrictEqual(output, target);
  assert.equal(Object.isFrozen(output), true);
});
