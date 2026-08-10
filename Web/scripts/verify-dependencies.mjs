import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { accessSync, constants, existsSync, lstatSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, relative, resolve, sep } from "node:path";

let requestedRoot;
let skipBundle = false;
for (let index = 2; index < process.argv.length; index += 1) {
  if (process.argv[index] === "--repository-root" && process.argv[index + 1]) {
    requestedRoot = process.argv[index + 1];
    index += 1;
  } else if (process.argv[index] === "--skip-bundle") {
    skipBundle = true;
  } else {
    throw new Error("usage: verify-dependencies.mjs [--repository-root PATH] [--skip-bundle]");
  }
}

const repositoryRoot = resolve(requestedRoot ?? resolve(import.meta.dirname, "../.."));
const webRoot = resolve(repositoryRoot, "Web");
const bundleRoot = resolve(repositoryRoot, "Sources/MillerAvatarHost/Resources/Web");
const staticRoot = resolve(repositoryRoot, "Resources/Static");
const installedRoot = resolve(webRoot, "node_modules");
const installedTreePresent = existsSync(installedRoot);
const manifest = readJSON(resolve(webRoot, "package.json"));
const packageLockPath = resolve(webRoot, "package-lock.json");
const packageLockBytes = readFileSync(packageLockPath);
const packageLockHash = sha256(packageLockBytes);
const lock = JSON.parse(packageLockBytes.toString("utf8"));
const bundleManifest = readJSON(resolve(bundleRoot, "bundle-manifest.json"));
const bundleMetafile = readJSON(resolve(bundleRoot, "bundle-metafile.json"));
const buildManifest = readJSON(resolve(repositoryRoot, "Resources/build-manifest.json"));
const esbuildBinary = resolve(installedRoot, "@esbuild/darwin-arm64/bin/esbuild");
const reviewedEsbuildBinaryHash = bundleManifest.toolchain?.esbuild_binary_sha256;
const legalFiles = [
  { source: "LICENSE", output: "Contents/Resources/Legal/LICENSE" },
  { source: "NOTICE", output: "Contents/Resources/Legal/NOTICE" },
  { source: "THIRD_PARTY_NOTICES.md", output: "Contents/Resources/Legal/THIRD_PARTY_NOTICES.md" },
];
assert.equal(existsSync(resolve(repositoryRoot, "Resources/Web")), false, "loose renderer source tree must not exist");
assert.deepEqual(
  walkFiles(bundleRoot).map((path) => relative(bundleRoot, path).split(sep).join("/")).sort(),
  ["app.js", "bundle-manifest.json", "bundle-metafile.json", "index.html", "styles.css"],
  "renderer resource bundle must contain exactly the committed five files",
);

const exactDependencies = {
  dependencies: {
    "@pixiv/three-vrm": "3.5.5",
    "@pixiv/three-vrm-animation": "3.5.5",
    three: "0.180.0",
  },
  devDependencies: {
    esbuild: "0.28.1",
    typescript: "7.0.2",
  },
  optionalDependencies: {
    "@esbuild/darwin-arm64": "0.28.1",
  },
};

assert.deepEqual(manifest.engines, { node: "22.22.0", npm: "10.9.4" });
assert.equal(manifest.packageManager, "npm@10.9.4");
assert.equal(packageLockHash, "38b7964641d9c5f7a28a7e22e6d84101c703fd084a058157025c70ace9d85fd4", "package-lock.json is not the reviewed release graph");
for (const [section, expected] of Object.entries(exactDependencies)) {
  assert.deepEqual(manifest[section], expected, `${section} must contain only exact approved versions`);
  assert.deepEqual(lock.packages[""][section], expected, `lockfile root ${section} differs from package.json`);
}
assert.equal(lock.lockfileVersion, 3);

for (const [packagePath, record] of Object.entries(lock.packages)) {
  if (packagePath === "") continue;
  const name = packageName(packagePath);
  const expectedVersion = allowedPackageVersion(name);
  assert.equal(record.version, expectedVersion, `unexpected package or version: ${name}@${record.version}`);
  assert.match(record.resolved ?? "", /^https:\/\/registry\.npmjs\.org\//u, `${name} lacks registry provenance`);
  assert.match(record.integrity ?? "", /^sha512-[A-Za-z0-9+/]+={0,2}$/u, `${name} lacks npm integrity`);
  assert.ok(["MIT", "Apache-2.0"].includes(record.license), `${name} has unapproved or missing license: ${record.license}`);
  if (record.hasInstallScript) {
    assert.equal(name, "esbuild", `unexpected lifecycle script in ${name}`);
  }
  const installedManifest = resolve(webRoot, packagePath, "package.json");
  if (installedTreePresent && record.optional !== true) {
    assert.ok(existsSync(installedManifest), `required installed package is missing: ${name}`);
  }
  if (existsSync(installedManifest)) {
    const installed = readJSON(installedManifest);
    assert.equal(installed.name, name, `installed package name differs from lockfile: ${name}`);
    assert.equal(installed.version, record.version, `installed ${name} differs from lockfile`);
    assert.equal(installed.license, record.license, `installed ${name} license differs from lockfile`);
  }
}

assert.equal(bundleManifest.toolchain?.esbuild_binary, "@esbuild/darwin-arm64@0.28.1");
assert.equal(typeof reviewedEsbuildBinaryHash, "string", "bundle manifest must record the esbuild binary hash");
assert.match(reviewedEsbuildBinaryHash, /^[0-9a-f]{64}$/u, "bundle manifest esbuild binary hash has invalid shape");
assert.ok(existsSync(esbuildBinary), `pinned esbuild binary is missing: ${esbuildBinary}`);
const esbuildStats = lstatSync(esbuildBinary);
assert.ok(esbuildStats.isFile(), "pinned esbuild binary must be a regular file");
try {
  accessSync(esbuildBinary, constants.X_OK);
} catch {
  assert.fail("pinned esbuild binary must be executable by the current user");
}
assert.equal(sha256(readFileSync(esbuildBinary)), reviewedEsbuildBinaryHash, "installed esbuild binary differs from reviewed bundle hash");

const publicExcludedRoots = [
  resolve(repositoryRoot, ".git"),
  resolve(repositoryRoot, ".build"),
  resolve(repositoryRoot, ".generated"),
  resolve(repositoryRoot, "Web/node_modules"),
];
const generatedRoot = resolve(repositoryRoot, ".generated");
const generatedCacheRoot = resolve(generatedRoot, "web-npm-cache");
assertNoForbiddenAssets(walkFiles(repositoryRoot, publicExcludedRoots), "public tree");
assertNoForbiddenAssets(walkFiles(generatedRoot), "generated tree");

for (const root of [bundleRoot, staticRoot, resolve(repositoryRoot, "Fixtures"), generatedRoot]) {
  const excludedRoots = root === generatedRoot ? [generatedCacheRoot] : [];
  for (const path of walkFiles(root, excludedRoots)) {
    const bytes = readFileSync(path);
    if (bytes.includes(0)) continue;
    const text = bytes.toString("utf8");
    assert.doesNotMatch(text, /\/Users\/|\/private\/var\/|MILLER_AVATAR_PRIVATE_FIXTURE_ROOT/u, `private path in ${relative(repositoryRoot, path)}`);
  }
}

const publishedApp = resolve(repositoryRoot, ".generated/Miller Avatar Alpha.app");
if (existsSync(publishedApp)) {
  assert.equal(existsSync(resolve(publishedApp, "Contents/Resources/Web")), false, "signed app must not contain a loose Web resource tree");
  assert.ok(
    existsSync(resolve(publishedApp, "Contents/Resources/MillerAvatar_MillerAvatarHost.bundle/Web")),
    "signed app must contain the SwiftPM host resource bundle",
  );
  const actualLegalFiles = walkFiles(resolve(publishedApp, "Contents/Resources/Legal"))
    .map((path) => relative(publishedApp, path).split(sep).join("/"));
  assert.deepEqual(new Set(actualLegalFiles), new Set(legalFiles.map(({ output }) => output)), "signed app legal files differ from the release contract");
  for (const { source, output } of legalFiles) {
    const embeddedPath = resolve(publishedApp, output);
    assert.ok(existsSync(embeddedPath), `signed app is missing legal file: ${output}`);
    assert.deepEqual(readFileSync(embeddedPath), readFileSync(resolve(repositoryRoot, source)), `signed app legal file differs: ${output}`);
  }
}

if (skipBundle) {
  console.log(`verified ${Object.keys(lock.packages).length - 1} locked packages before bundle generation`);
  process.exit(0);
}

assert.equal(bundleManifest.schema, "miller-avatar.web-bundle/v2");
assert.deepEqual(bundleManifest.outputs, [
  "app.js",
  "bundle-manifest.json",
  "bundle-metafile.json",
  "index.html",
  "styles.css",
]);
assert.deepEqual(Object.keys(bundleManifest.files).sort(), ["app.js", "bundle-metafile.json", "index.html", "styles.css"]);
assert.equal(bundleManifest.toolchain.node, "22.22.0");
assert.equal(bundleManifest.toolchain.npm, "10.9.4");
assert.equal(bundleManifest.toolchain.esbuild, "0.28.1");
assert.equal(bundleManifest.toolchain.esbuild_binary, "@esbuild/darwin-arm64@0.28.1");
assert.equal(bundleManifest.toolchain.package_lock_sha256, packageLockHash);

const completeRemoteURL = /(?:https?|wss?):\/\/[^"'`\\\s]+/gu;
for (const path of walkFiles(bundleRoot)) {
  const bytes = readFileSync(path);
  if (bytes.includes(0)) continue;
  const urls = bytes.toString("utf8").match(completeRemoteURL) ?? [];
  assert.deepEqual(urls, [], `complete remote URL literal in ${relative(repositoryRoot, path)}`);
}

const allowedBundleInputs = new Set([
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
  "src/presentation.ts",
  "src/renderer.ts",
  "src/runtime.ts",
  "src/validation.ts",
]);
assert.deepEqual(new Set(Object.keys(bundleMetafile.inputs)), allowedBundleInputs, "bundle metafile has unknown or missing inputs");
assert.deepEqual(Object.keys(bundleMetafile.outputs), ["app.js"]);
assert.deepEqual(new Set(Object.keys(bundleMetafile.outputs["app.js"].inputs)), allowedBundleInputs);

const expectedManifestInputs = new Set([
  ...[...allowedBundleInputs].map((path) => `Web/${path}`),
  "Web/src/index.html",
  "Web/src/styles.css",
  "Web/package.json",
  "Web/package-lock.json",
  "Web/.npmrc",
  "scripts/bundle-web.sh",
]);
assert.deepEqual(new Set(Object.keys(bundleManifest.inputs)), expectedManifestInputs, "bundle manifest has unknown or missing inputs");
for (const [path, expected] of Object.entries(bundleManifest.inputs)) {
  assertSafeRelativePath(path);
  const bytes = readFileSync(resolve(repositoryRoot, path));
  assert.deepEqual(expected, { bytes: bytes.byteLength, sha256: sha256(bytes) }, `stale bundle input: ${path}`);
}
for (const [name, expected] of Object.entries(bundleManifest.files)) {
  assert.equal(basename(name), name);
  const bytes = readFileSync(resolve(bundleRoot, name));
  assert.equal(expected.bytes, bytes.byteLength, `stale byte count: ${name}`);
  assert.equal(expected.sha256, sha256(bytes), `stale output hash: ${name}`);
}
const { contract_sha256: contractHash, ...bundleContract } = bundleManifest;
assert.equal(contractHash, sha256(Buffer.from(canonicalJSON(bundleContract))), "stale bundle contract hash");

assert.equal(buildManifest.schema, "miller-avatar.build-manifest/v1");
assert.deepEqual(buildManifest.product, {
  name: "Miller Avatar Alpha",
  bundle_identifier: "ai.millrace.miller-avatar.alpha",
  short_version: "0.0.1",
  build_version: "1",
  deployment_target: "15.0",
});
assert.deepEqual(buildManifest.toolchain, {
  command_line_tools: "16.4.0.0.1.1747106510",
  swift: "6.1.2",
  clang: "17.0.0",
  macos_sdk: "15.5",
  architecture: "arm64",
});
assert.match(buildManifest.source_revision, /^[0-9a-f]{40}$/u);
assert.match(buildManifest.executable_input_sha256, /^[0-9a-f]{64}$/u);
assert.match(buildManifest.web_bundle_manifest_sha256, /^[0-9a-f]{64}$/u);
const expectedNativeInputs = new Set([
  "Package.swift",
  "Config/Info.plist",
  "Config/MillerAvatarAlpha.entitlements",
  ...legalFiles.map(({ source }) => source),
  "scripts/build.sh",
  "scripts/verify-toolchain.sh",
  ...walkFiles(resolve(repositoryRoot, "Sources")).filter((path) => path.endsWith(".swift")).map(repositoryPath),
  ...walkFiles(staticRoot).map(repositoryPath),
  ...walkFiles(bundleRoot).map(repositoryPath),
]);
assert.deepEqual(new Set(buildManifest.inputs.map((record) => record.path)), expectedNativeInputs, "native manifest has unknown or missing inputs");
for (const record of buildManifest.inputs) {
  const bytes = readFileSync(resolve(repositoryRoot, record.path));
  assert.deepEqual(record, { path: record.path, byte_count: bytes.byteLength, sha256: sha256(bytes) }, `stale native input: ${record.path}`);
}
const executableInputRecords = buildManifest.inputs.filter(({ path }) =>
  path === "Package.swift"
  || path === "scripts/build.sh"
  || path === "scripts/verify-toolchain.sh"
  || (path.startsWith("Sources/") && path.endsWith(".swift")));
const executableInputBytes = Buffer.from(executableInputRecords
  .map(({ path, byte_count: byteCount, sha256: digest }) => `${path}\t${byteCount}\t${digest}\n`)
  .join(""));
assert.equal(buildManifest.executable_input_sha256, sha256(executableInputBytes), "stale executable-input hash");
assert.equal(
  buildManifest.web_bundle_manifest_sha256,
  sha256(readFileSync(resolve(bundleRoot, "bundle-manifest.json"))),
  "stale web-bundle manifest hash",
);
const expectedNativeFiles = new Set([
  "Contents/Info.plist",
  ...legalFiles.map(({ output }) => output),
  ...walkFiles(staticRoot)
    .map((path) => `Contents/Resources/Static/${relative(staticRoot, path).split(sep).join("/")}`),
  ...walkFiles(bundleRoot)
    .map((path) => `Contents/Resources/MillerAvatar_MillerAvatarHost.bundle/Web/${relative(bundleRoot, path).split(sep).join("/")}`),
]);
assert.deepEqual(new Set(buildManifest.files.map((record) => record.path)), expectedNativeFiles, "native manifest has unknown or missing outputs");
for (const record of buildManifest.files) {
  assert.deepEqual(Object.keys(record).sort(), ["byte_count", "path", "sha256"]);
  assert.match(record.sha256, /^[0-9a-f]{64}$/u);
  assert.ok(Number.isSafeInteger(record.byte_count) && record.byte_count >= 0);
  let sourcePath;
  if (record.path === "Contents/Info.plist") sourcePath = resolve(repositoryRoot, "Config/Info.plist");
  else if (record.path.startsWith("Contents/Resources/Legal/")) sourcePath = resolve(repositoryRoot, record.path.slice("Contents/Resources/Legal/".length));
  else if (record.path.startsWith("Contents/Resources/Static/")) sourcePath = resolve(staticRoot, record.path.slice("Contents/Resources/Static/".length));
  else if (record.path.startsWith("Contents/Resources/MillerAvatar_MillerAvatarHost.bundle/Web/")) {
    sourcePath = resolve(bundleRoot, record.path.slice("Contents/Resources/MillerAvatar_MillerAvatarHost.bundle/Web/".length));
  }
  if (sourcePath) {
    const bytes = readFileSync(sourcePath);
    assert.equal(record.byte_count, bytes.byteLength, `stale native resource size: ${record.path}`);
    assert.equal(record.sha256, sha256(bytes), `stale native resource hash: ${record.path}`);
  }
}

const serializedBundleMetadata = JSON.stringify({ bundleManifest, bundleMetafile });
assert.doesNotMatch(serializedBundleMetadata, /AIRI|airi|sourceMappingURL|(?:^|["'])\/(?:Users|private\/var|home)\//u);
assert.doesNotMatch(serializedBundleMetadata, /"authors?"\s*:/u, "bundle metadata must not contain author metadata");
const bundleJavaScript = readFileSync(resolve(bundleRoot, "app.js"), "utf8");
assert.doesNotMatch(bundleJavaScript, /(?:AIRI|airi|sourceMappingURL|data:application\/wasm|WebSocket|EventSource|serviceWorker|new Worker)/u);

const provenance = readFileSync(resolve(repositoryRoot, "PROVENANCE.md"), "utf8");
const notices = readFileSync(resolve(repositoryRoot, "THIRD_PARTY_NOTICES.md"), "utf8");
const productNotice = readFileSync(resolve(repositoryRoot, "NOTICE"), "utf8");
for (const required of ["three@0.180.0", "@pixiv/three-vrm@3.5.5", "@pixiv/three-vrm-animation@3.5.5", "typescript@7.0.2", "esbuild@0.28.1", "WebKit"]) {
  assert.ok(provenance.includes(required), `PROVENANCE.md lacks ${required}`);
}
for (const required of [
  "three.js authors",
  "pixiv Inc.",
  "Mapbox",
  "ISC License",
  "MIT License",
  "Apache License 2.0",
]) {
  assert.ok(notices.includes(required), `THIRD_PARTY_NOTICES.md lacks ${required}`);
}
assert.ok(productNotice.includes("THIRD_PARTY_NOTICES.md"));

console.log(`verified ${Object.keys(lock.packages).length - 1} locked packages and ${allowedBundleInputs.size} emitted inputs`);

function allowedPackageVersion(name) {
  if (name === "three") return "0.180.0";
  if (name === "esbuild" || name.startsWith("@esbuild/")) return "0.28.1";
  if (name === "typescript" || name.startsWith("@typescript/typescript-")) return "7.0.2";
  if (name === "@pixiv/three-vrm" || name.startsWith("@pixiv/three-vrm-") || name.startsWith("@pixiv/types-vrm")) return "3.5.5";
  throw new Error(`unapproved locked package: ${name}`);
}

function packageName(packagePath) {
  const segments = packagePath.split("/").slice(1);
  return segments[0].startsWith("@") ? `${segments[0]}/${segments[1]}` : segments[0];
}

function assertSafeRelativePath(path) {
  assert.ok(path.length > 0 && !path.startsWith("/") && !path.split("/").includes(".."), `unsafe path: ${path}`);
}

function canonicalJSON(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJSON(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function readJSON(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function repositoryPath(path) {
  return relative(repositoryRoot, path).split(sep).join("/");
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function assertNoForbiddenAssets(paths, scope) {
  for (const path of paths) {
    assert.doesNotMatch(
      relative(repositoryRoot, path).toLowerCase(),
      /\.(?:vrm|glb|vrma|png|jpe?g|heic|webp)$/u,
      `forbidden asset in ${scope}: ${relative(repositoryRoot, path)}`,
    );
  }
}

function walkFiles(root, excludedRoots = []) {
  if (!existsSync(root)) return [];
  if (excludedRoots.some((excludedRoot) => root === excludedRoot || root.startsWith(`${excludedRoot}${sep}`))) return [];
  const result = [];
  for (const entry of readdirSync(root)) {
    const path = resolve(root, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) result.push(...walkFiles(path, excludedRoots));
    else if (stats.isFile()) result.push(path);
  }
  return result;
}
