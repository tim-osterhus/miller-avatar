import { spawnSync } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import { build } from "esbuild";

const expectedNodeVersion = "v22.22.0";
const expectedNpmVersion = "10.9.4";
const npmVersion = spawnSync("npm", ["--version"], { encoding: "utf8" });
const observedNpmVersion = npmVersion.status === 0 ? npmVersion.stdout.trim() : "<unavailable>";

if (process.version !== expectedNodeVersion || observedNpmVersion !== expectedNpmVersion) {
  console.error(
    `Miller Avatar contract toolchain mismatch: expected Node ${expectedNodeVersion} and npm ${expectedNpmVersion}; observed Node ${process.version} and npm ${observedNpmVersion}.`,
  );
  process.exitCode = 1;
} else if (!process.argv.includes("--check-toolchain")) {
  const buildDirectory = new URL("../.build/", import.meta.url);
  await mkdir(buildDirectory, { recursive: true });
  const testsDirectory = new URL("../tests/", import.meta.url);
  const testFiles = (await readdir(testsDirectory))
    .filter((name) => name.endsWith(".test.ts"))
    .sort();
  if (testFiles.length === 0) {
    throw new Error("no TypeScript tests found");
  }
  await build({
    entryPoints: testFiles.map((name) => new URL(`../tests/${name}`, import.meta.url).pathname),
    outdir: buildDirectory.pathname,
    outExtension: { ".js": ".mjs" },
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    sourcemap: false,
  });
}
