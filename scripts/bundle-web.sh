#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
web_root="$repo_root/Web"
generated_root="$repo_root/.generated"
web_npm_cache="$generated_root/web-npm-cache"
output="$repo_root/Sources/MillerAvatarHost/Resources/Web"
expected_node_version="v22.22.0"
expected_npm_version="10.9.4"
pinned_node_bin="/opt/homebrew/Cellar/node@22/22.22.0/bin"

if [[ -x "$pinned_node_bin/node" ]]; then
    PATH="$pinned_node_bin:$PATH"
    export PATH
fi

node_version=$(node --version 2>/dev/null || true)
npm_version=$(npm --version 2>/dev/null || true)
if [[ "$node_version" != "$expected_node_version" || "$npm_version" != "$expected_npm_version" ]]; then
    printf 'Miller Avatar bundle toolchain mismatch: expected Node %s and npm %s; observed Node %s and npm %s\n' \
        "$expected_node_version" "$expected_npm_version" "${node_version:-<unavailable>}" "${npm_version:-<unavailable>}" >&2
    exit 1
fi

mkdir -p "$generated_root"
stage=$(mktemp -d "$generated_root/web-stage.XXXXXX")
backup=""
published=0

cleanup() {
    status=$?
    set +e
    if [[ "$published" != "1" && -n "$backup" && -e "$backup" && ! -e "$output" ]]; then
        mv -- "$backup" "$output"
    fi
    if [[ -d "$stage" ]]; then
        rm -rf -- "$stage"
    fi
    if [[ "$published" == "1" && -n "$backup" && -e "$backup" ]]; then
        rm -rf -- "$backup"
    fi
    if [[ -d "$web_npm_cache/_logs" ]]; then
        rm -rf -- "$web_npm_cache/_logs"
    fi
    exit "$status"
}
trap cleanup EXIT

case "$stage" in
    "$generated_root"/web-stage.*) ;;
    *) printf 'invalid web stage path\n' >&2; exit 1 ;;
esac

mkdir -p "$web_npm_cache"
export NPM_CONFIG_CACHE="$web_npm_cache"
export NPM_CONFIG_OFFLINE=true
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_UPDATE_NOTIFIER=false

(
    cd "$web_root"
    npm run toolchain:check
    install_mode=${MILLER_AVATAR_WEB_SKIP_INSTALL:-auto}
    if [[ "$install_mode" == auto && -x "$web_root/node_modules/@esbuild/darwin-arm64/bin/esbuild" ]]; then
        install_mode=1
    elif [[ "$install_mode" == auto ]]; then
        install_mode=0
    fi
    case "$install_mode" in
        0)
            npm ci --offline --ignore-scripts --no-audit --no-fund
            ;;
        1)
            printf 'using existing Web/node_modules (offline skip-install mode)\n'
            ;;
        *)
            printf 'MILLER_AVATAR_WEB_SKIP_INSTALL must be auto, 0, or 1\n' >&2
            exit 1
            ;;
    esac
    rm -rf -- "$web_npm_cache/_logs"
    node scripts/verify-dependencies.mjs --skip-bundle
    "$web_root/node_modules/@esbuild/darwin-arm64/bin/esbuild" src/index.ts \
        --bundle \
        --format=esm \
        --platform=browser \
        --target=es2023 \
        --minify \
        --outfile="$stage/app.js" \
        --metafile="$stage/raw-metafile.json" \
        --legal-comments=none
)

STAGED_APP="$stage/app.js" node --input-type=module <<'NODE'
import { readFileSync, writeFileSync } from "node:fs";

const path = process.env.STAGED_APP;
if (!path) throw new Error("missing staged app path");
let app = readFileSync(path, "utf8");
const replacements = [
  {
    label: "inert tangent-space shader reference",
    from: "http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html",
    to: "tangent-space normal mapping reference",
  },
  {
    label: "HTML namespace value",
    from: '"http://www.w3.org/1999/xhtml"',
    to: '"http:"+"//www.w3.org/1999/xhtml"',
  },
  {
    label: "VRM license URL value",
    from: '"https://vrm.dev/licenses/1.0/"',
    to: '"https:"+"//vrm.dev/licenses/1.0/"',
  },
];
for (const { label, from, to } of replacements) {
  const first = app.indexOf(from);
  if (first < 0 || app.indexOf(from, first + from.length) >= 0) {
    throw new Error(`expected exactly one ${label} transformation target`);
  }
  app = `${app.slice(0, first)}${to}${app.slice(first + from.length)}`;
}
const completeRemoteURL = /(?:https?|wss?):\/\/[^"'`\\\s]+/gu;
const remainingURLs = app.match(completeRemoteURL) ?? [];
if (remainingURLs.length > 0) {
  throw new Error(`bundle URL transformations incomplete: ${remainingURLs.join(", ")}`);
}
writeFileSync(path, app.replace(/[ \t]+$/gmu, ""));
NODE

cp "$web_root/src/index.html" "$stage/index.html"
cp "$web_root/src/styles.css" "$stage/styles.css"

REPO_ROOT="$repo_root" WEB_ROOT="$web_root" STAGE_ROOT="$stage" NPM_VERSION="$npm_version" node --input-type=module <<'NODE'
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, relative, resolve } from "node:path";

const repo = process.env.REPO_ROOT;
const web = process.env.WEB_ROOT;
const stage = process.env.STAGE_ROOT;
const npmVersion = process.env.NPM_VERSION;
if (!repo || !web || !stage || !npmVersion) throw new Error("missing normalized bundle paths");

const raw = JSON.parse(readFileSync(resolve(stage, "raw-metafile.json"), "utf8"));
const outputRecords = Object.values(raw.outputs);
if (outputRecords.length !== 1) throw new Error("expected exactly one JavaScript bundle output");
outputRecords[0].bytes = readFileSync(resolve(stage, "app.js")).byteLength;
const within = (root, value) => value === root || value.startsWith(`${root}/`);
const absoluteFromWeb = (value) => {
  const absolute = resolve(web, value);
  if (!within(web, absolute)) throw new Error(`bundle input escapes Web/: ${value}`);
  return absolute;
};
const relativeFromRepo = (absolute) => {
  if (!within(repo, absolute)) throw new Error(`bundle path escapes repository: ${absolute}`);
  return relative(repo, absolute);
};
const normalizeInput = (value) => relative(web, absoluteFromWeb(value));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fileRecord = (absolute) => {
  const bytes = readFileSync(absolute);
  return { bytes: bytes.byteLength, sha256: sha256(bytes) };
};
const sortedRecord = (entries) => Object.fromEntries([...entries].sort(([left], [right]) => left.localeCompare(right)));
const canonicalJSON = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJSON(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
};

const metafile = {
  inputs: sortedRecord(Object.entries(raw.inputs).map(([key, value]) => [normalizeInput(key), value])),
  outputs: sortedRecord(Object.entries(raw.outputs).map(([key, value]) => [basename(key), {
    bytes: value.bytes,
    inputs: sortedRecord(Object.entries(value.inputs ?? {}).map(([input, detail]) => [normalizeInput(input), detail])),
  }])),
};
writeFileSync(resolve(stage, "bundle-metafile.json"), `${JSON.stringify(metafile, null, 2)}\n`);

const inputPaths = new Map(Object.keys(raw.inputs).map((input) => {
  const absolute = absoluteFromWeb(input);
  return [relativeFromRepo(absolute), absolute];
}));
for (const relativePath of [
  "Web/src/index.html",
  "Web/src/styles.css",
  "Web/package.json",
  "Web/package-lock.json",
  "Web/.npmrc",
  "scripts/bundle-web.sh",
]) {
  inputPaths.set(relativePath, resolve(repo, relativePath));
}
const inputRecords = sortedRecord([...inputPaths].map(([name, absolute]) => [name, fileRecord(absolute)]));
const payloadMimes = {
  "app.js": "text/javascript; charset=utf-8",
  "bundle-metafile.json": "application/json; charset=utf-8",
  "index.html": "text/html; charset=utf-8",
  "styles.css": "text/css; charset=utf-8",
};
const files = sortedRecord(Object.entries(payloadMimes).map(([name, mime]) => [name, {
  ...fileRecord(resolve(stage, name)),
  mime,
}]));
const binary = resolve(web, "node_modules/@esbuild/darwin-arm64/bin/esbuild");
const reviewedBundleManifest = JSON.parse(readFileSync(resolve(repo, "Sources/MillerAvatarHost/Resources/Web/bundle-manifest.json"), "utf8"));
const reviewedBinaryHash = reviewedBundleManifest.toolchain?.esbuild_binary_sha256;
if (typeof reviewedBinaryHash !== "string" || !/^[0-9a-f]{64}$/u.test(reviewedBinaryHash)) {
  throw new Error("reviewed bundle manifest has an invalid esbuild binary hash");
}
const installedBinaryHash = sha256(readFileSync(binary));
if (installedBinaryHash !== reviewedBinaryHash) {
  throw new Error("installed esbuild binary differs from the reviewed bundle hash");
}
const contract = {
  schema: "miller-avatar.web-bundle/v2",
  outputs: ["app.js", "bundle-manifest.json", "bundle-metafile.json", "index.html", "styles.css"],
  manifest: {
    name: "bundle-manifest.json",
    mime: "application/json; charset=utf-8",
  },
  toolchain: {
    node: process.version.slice(1),
    npm: npmVersion,
    esbuild: "0.28.1",
    esbuild_binary: "@esbuild/darwin-arm64@0.28.1",
    esbuild_binary_sha256: reviewedBinaryHash,
    package_lock_sha256: sha256(readFileSync(resolve(web, "package-lock.json"))),
  },
  inputs: inputRecords,
  files,
};
const manifest = {
  ...contract,
  contract_sha256: sha256(Buffer.from(canonicalJSON(contract))),
};
writeFileSync(resolve(stage, "bundle-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
NODE

rm "$stage/raw-metafile.json"

expected=$(printf '%s\n' app.js bundle-manifest.json bundle-metafile.json index.html styles.css)
actual=$(find "$stage" -maxdepth 1 -type f -exec basename {} \; | sort)
if [[ "$actual" != "$expected" ]]; then
    printf 'web bundle outputs differ from the five-file contract\n%s\n' "$actual" >&2
    exit 1
fi

if find "$stage" -type f \( -name '*.map' -o -name '*.vrm' -o -name '*.glb' -o -name '*.vrma' -o -name '*.wasm' -o -name '*.png' -o -name '*.jpeg' -o -name '*.jpg' -o -name '*.heic' -o -name '*.webp' \) -print -quit | grep -q .; then
    printf 'web bundle contains a forbidden asset\n' >&2
    exit 1
fi
if grep -R -n -E 'WebSocket|EventSource|new Worker|serviceWorker' "$stage"; then
    printf 'web bundle contains a forbidden capability\n' >&2
    exit 1
fi
if grep -R -n -E 'AIRI|airi|sourceMappingURL|/Users/|/private/var/|MILLER_AVATAR_PRIVATE_FIXTURE_ROOT' "$stage"; then
    printf 'web bundle contains prohibited source, path, or metadata\n' >&2
    exit 1
fi
if grep -R -n -E '(https?|wss?)://[^"[:space:]\\]+' "$stage"; then
    printf 'web bundle contains a complete remote URL literal\n' >&2
    exit 1
fi
if grep -R -n -F "$repo_root" "$stage"; then
    printf 'web bundle metadata contains an absolute repository path\n' >&2
    exit 1
fi

if [[ "${MILLER_AVATAR_SIMULATE_BUNDLE_FAILURE:-}" == "1" ]]; then
    printf 'simulated web bundle failure\n' >&2
    exit 1
fi

mkdir -p "$(dirname -- "$output")"
if [[ -e "$output" ]]; then
    backup=$(mktemp -d "$generated_root/web-previous.XXXXXX")
    rmdir "$backup"
    mv -- "$output" "$backup"
fi
if ! mv -- "$stage" "$output"; then
    if [[ -n "$backup" && -e "$backup" ]]; then mv -- "$backup" "$output"; fi
    exit 1
fi
published=1
if [[ -n "$backup" && -e "$backup" ]]; then
    rm -rf -- "$backup"
fi
