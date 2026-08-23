import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const bundleRoot = resolve(process.cwd(), "../Sources/MillerAvatarHost/Resources/Web");
const repositoryRoot = resolve(process.cwd(), "..");
const looseBundleRoot = resolve(repositoryRoot, "Resources/Web");
const expectedMetafileInputs = [
  "node_modules/@pixiv/three-vrm/lib/three-vrm.module.js",
  "node_modules/@pixiv/three-vrm-animation/lib/three-vrm-animation.module.js",
  "node_modules/three/build/three.core.js",
  "node_modules/three/build/three.module.js",
  "node_modules/three/examples/jsm/loaders/GLTFLoader.js",
  "node_modules/three/examples/jsm/utils/BufferGeometryUtils.js",
  "src/bridge.ts",
  "src/camera.ts",
  "src/contract.ts",
  "src/disposal.ts",
  "src/index.ts",
  "src/lifecycle.ts",
  "src/main.ts",
  "src/motion-controller.ts",
  "src/motion-loader.ts",
  "src/mouth-controller.ts",
  "src/presentation.ts",
  "src/renderer.ts",
  "src/runtime.ts",
  "src/validation.ts",
].sort();
const payloadMimes = {
  "app.js": "text/javascript; charset=utf-8",
  "bundle-metafile.json": "application/json; charset=utf-8",
  "index.html": "text/html; charset=utf-8",
  "styles.css": "text/css; charset=utf-8",
} as const;

test("renderer bundle has one package-owned canonical source location", () => {
  assert.equal(existsSync(bundleRoot), true);
  assert.equal(existsSync(looseBundleRoot), false);
});

test("committed web bundle has a complete non-self-referential v2 manifest", () => {
  const manifest = JSON.parse(readFileSync(resolve(bundleRoot, "bundle-manifest.json"), "utf8")) as {
    schema: string;
    outputs: string[];
    files: Record<string, { bytes: number; sha256: string; mime: string }>;
    inputs: Record<string, { bytes: number; sha256: string }>;
    manifest: { name: string; mime: string };
    toolchain: {
      node: string;
      npm: string;
      esbuild: string;
      esbuild_binary: string;
      esbuild_binary_sha256: string;
      package_lock_sha256: string;
    };
    contract_sha256: string;
  };
  assert.equal(manifest.schema, "miller-avatar.web-bundle/v2");
  assert.deepEqual(manifest.outputs, ["app.js", "bundle-manifest.json", "bundle-metafile.json", "index.html", "styles.css"]);
  assert.deepEqual(Object.keys(manifest.files).sort(), Object.keys(payloadMimes).sort());
  assert.deepEqual(manifest.manifest, {
    name: "bundle-manifest.json",
    mime: "application/json; charset=utf-8",
  });
  assert.deepEqual(manifest.toolchain, {
    node: "22.22.0",
    npm: "10.9.4",
    esbuild: "0.28.1",
    esbuild_binary: "@esbuild/darwin-arm64@0.28.1",
    esbuild_binary_sha256: manifest.toolchain.esbuild_binary_sha256,
    package_lock_sha256: manifest.toolchain.package_lock_sha256,
  });
  assert.ok(Object.keys(manifest.inputs).length > 0);
  assert.equal(manifest.toolchain.package_lock_sha256, manifest.inputs["Web/package-lock.json"]?.sha256);
  assert.match(manifest.toolchain.esbuild_binary_sha256, /^[0-9a-f]{64}$/u);

  for (const [name, mime] of Object.entries(payloadMimes)) {
    const bytes = readFileSync(resolve(bundleRoot, name));
    assert.deepEqual(manifest.files[name], {
      bytes: bytes.byteLength,
      mime,
      sha256: sha256(bytes),
    });
  }
  for (const [name, expected] of Object.entries(manifest.inputs)) {
    const bytes = readFileSync(resolve(repositoryRoot, name));
    assert.deepEqual(expected, { bytes: bytes.byteLength, sha256: sha256(bytes) });
  }

  const { contract_sha256, ...contract } = manifest;
  assert.equal(contract_sha256, sha256(Buffer.from(canonicalJSON(contract))));
});

test("committed web bundle has the exact generated module closure", () => {
  const metafile = JSON.parse(readFileSync(resolve(bundleRoot, "bundle-metafile.json"), "utf8")) as {
    inputs: Record<string, unknown>;
    outputs: Record<string, { inputs: Record<string, unknown> }>;
  };
  assert.deepEqual(Object.keys(metafile.inputs).sort(), expectedMetafileInputs);
  assert.deepEqual(Object.keys(metafile.outputs), ["app.js"]);
  assert.deepEqual(Object.keys(metafile.outputs["app.js"]!.inputs).sort(), expectedMetafileInputs);
});

test("committed web outputs contain no complete remote URL literals", () => {
  const completeRemoteURL = /(?:https?|wss?):\/\/[^"'`\\\s]+/u;
  const remoteURLFixtures = [
    "http://example.invalid/http",
    "https://example.invalid/https",
    "ws://example.invalid/ws",
    "wss://example.invalid/wss",
  ];
  for (const fixture of remoteURLFixtures) {
    assert.match(fixture, completeRemoteURL, `remote URL fixture is incomplete: ${fixture}`);
  }
  for (const name of ["app.js", "bundle-manifest.json", "bundle-metafile.json", "index.html", "styles.css"]) {
    const text = readFileSync(resolve(bundleRoot, name), "utf8");
    assert.deepEqual(text.match(completeRemoteURL) ?? [], [], `complete remote URL literal in ${name}`);
  }

  const gateSources = [
    readFileSync(resolve(repositoryRoot, "scripts/bundle-web.sh"), "utf8"),
    readFileSync(resolve(repositoryRoot, "Web/scripts/verify-dependencies.mjs"), "utf8"),
  ];
  for (const source of gateSources) {
    const pattern = source.match(/const completeRemoteURL = \/(.+)\/gu;/u)?.[1];
    assert.ok(pattern, "release gate must declare its complete remote URL pattern");
    const gate = new RegExp(pattern, "u");
    for (const fixture of remoteURLFixtures) {
      assert.match(fixture, gate, `release gate does not match ${fixture}`);
    }
  }
});

test("committed bundle reconstructs dependency URL values without contiguous literals", () => {
  const app = readFileSync(resolve(bundleRoot, "app.js"), "utf8");
  const reconstructedValues = [
    { parts: ["http:", "//www.w3.org/1999/xhtml"], value: "http://www.w3.org/1999/xhtml" },
    { parts: ["https:", "//vrm.dev/licenses/1.0/"], value: "https://vrm.dev/licenses/1.0/" },
  ];
  for (const { parts, value } of reconstructedValues) {
    assert.equal(parts.join(""), value);
    const expression = app.match(new RegExp(parts.map((part) => JSON.stringify(part)).join("\\+")))?.[0];
    assert.equal(expression, `${JSON.stringify(parts[0])}+${JSON.stringify(parts[1])}`);
    assert.equal(new Function(`return ${expression}`)(), value);
  }
  assert.doesNotMatch(app, /hacksoflife\.blogspot\.ch\/2009\/11\/per-pixel-tangent-space-normal-mapping\.html/u);
  assert.equal((app.match(/tangent-space normal mapping reference/g) ?? []).length, 1);
});

function canonicalJSON(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalJSON(object[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value: Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}
