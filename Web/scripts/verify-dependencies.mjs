import { spawnSync } from "node:child_process";
import { accessSync, constants, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const lock = readJSON("package-lock.json");
const manifest = readJSON("package.json");
const expected = {
  "@pixiv/three-vrm": "3.5.5",
  "three": "0.180.0",
  "esbuild": "0.28.1",
  "typescript": "7.0.2",
  "@esbuild/darwin-arm64": "0.28.1",
};

for (const [name, version] of Object.entries(expected)) {
  if (declaredVersion(manifest, name) !== version || declaredVersion(lock.packages[""], name) !== version) {
    throw new Error(`dependency declaration for ${name} must be exactly ${version}`);
  }
  const installed = readJSON(`node_modules/${name}/package.json`);
  if (installed.version !== version) {
    throw new Error(`installed ${name} must be exactly ${version}; found ${installed.version ?? "<missing>"}`);
  }
}

if (process.platform !== "darwin" || process.arch !== "arm64") {
  throw new Error("the committed web bundle must be produced on darwin-arm64");
}
const esbuild = resolve(root, "node_modules/@esbuild/darwin-arm64/bin/esbuild");
accessSync(esbuild, constants.X_OK);
const binaryVersion = spawnSync(esbuild, ["--version"], { encoding: "utf8" });
if (binaryVersion.status !== 0 || binaryVersion.stdout.trim() !== expected.esbuild) {
  throw new Error(`pinned @esbuild/darwin-arm64 binary must report ${expected.esbuild}`);
}

console.log(`verified locked dependencies and @esbuild/darwin-arm64 ${expected.esbuild}`);

function declaredVersion(packageManifest, name) {
  return packageManifest.dependencies?.[name]
    ?? packageManifest.devDependencies?.[name]
    ?? packageManifest.optionalDependencies?.[name];
}

function readJSON(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
}
