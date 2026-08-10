#!/bin/bash

set -euo pipefail

repository_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd -P)
temporary_root=$(mktemp -d "${TMPDIR:-/tmp}/miller-avatar-release-contract.XXXXXX")
trap 'rm -rf -- "$temporary_root"' EXIT
pinned_node=/opt/homebrew/Cellar/node@22/22.22.0/bin/node
if [[ -x "$pinned_node" ]]; then
    node_command=$pinned_node
else
    node_command=$(command -v node || true)
fi
if [[ -z "$node_command" ]] || [[ $("$node_command" --version) != "v22.22.0" ]]; then
    printf 'Node 22.22.0 is required for the release-discipline contract\n' >&2
    exit 1
fi

for required in \
    "$repository_root/scripts/verify-dependencies.sh" \
    "$repository_root/scripts/test-release-discipline.sh" \
    "$repository_root/Resources/build-manifest.json" \
    "$repository_root/.github/workflows/ci.yml"
do
    test -f "$required"
done

test -x "$repository_root/scripts/verify-dependencies.sh"
test -x "$repository_root/scripts/test-release-discipline.sh"
test -d "$repository_root/Sources/MillerAvatarHost/Resources/Web"
test ! -e "$repository_root/Resources/Web"

if grep -R -n -E '(^|[;&|[:space:]])rg([[:space:]]|$)' \
    "$repository_root/.github" "$repository_root/scripts"
then
    printf 'public release paths depend on undeclared ripgrep tooling\n' >&2
    exit 1
fi

expected_source_revision=$(git -C "$repository_root" log -1 --format=%H -- \
    Package.swift Config/Info.plist Config/MillerAvatarAlpha.entitlements \
    LICENSE NOTICE THIRD_PARTY_NOTICES.md Sources Resources/Static \
    Sources/MillerAvatarHost/Resources/Web scripts/build.sh scripts/verify-toolchain.sh)
"$node_command" --input-type=module - \
    "$repository_root/Resources/build-manifest.json" \
    "$expected_source_revision" <<'NODE'
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(process.argv[2], "utf8"));
const expectedSourceRevision = process.argv[3];
assert.deepEqual(manifest.product, {
  name: "Miller Avatar Alpha",
  bundle_identifier: "ai.millrace.miller-avatar.alpha",
  short_version: "0.0.1",
  build_version: "1",
  deployment_target: "15.0",
});
assert.equal(manifest.source_revision, expectedSourceRevision);
assert.match(manifest.executable_input_sha256, /^[0-9a-f]{64}$/u);
assert.match(manifest.web_bundle_manifest_sha256, /^[0-9a-f]{64}$/u);
assert.equal(
  manifest.files.some(({ path }) => path === "Contents/MacOS/MillerAvatarApp"),
  false,
  "compiled executable output must remain in the external post-sign receipt",
);
NODE

if ! grep -A3 -F 'uses: actions/checkout@v4' "$repository_root/.github/workflows/ci.yml" |
    grep -Fq 'fetch-depth: 0'
then
    printf 'CI checkout must retain source history for filtered revision evidence\n' >&2
    exit 1
fi

if ! grep -q 'DARWIN_USER_CACHE_DIR' "$repository_root/scripts/test-release-discipline.sh"; then
    printf 'release discipline does not monitor the Darwin shared Clang cache\n' >&2
    exit 1
fi

for provenance_entry in \
    '## First-party research adaptation ledger' \
    'lab/assist/research/spikes/macos-popup-webview-visible/' \
    'lab/assist/research/spikes/avatar-contract-oracle/' \
    'Rewritten; no research-spike source file was copied into the public repository.'
do
    if ! grep -Fq "$provenance_entry" "$repository_root/PROVENANCE.md"; then
        printf 'PROVENANCE.md lacks first-party adaptation record: %s\n' "$provenance_entry" >&2
        exit 1
    fi
done

"$node_command" --input-type=module - "$repository_root/Web/package.json" <<'NODE'
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJSON = JSON.parse(readFileSync(process.argv[2], "utf8"));
assert.equal(packageJSON.dependencies["@pixiv/three-vrm-animation"], "3.5.5");
NODE

for provenance_entry in \
    '@pixiv/three-vrm-animation@3.5.5' \
    'VRMA 1.0 parsing and target-specific conversion of humanoid skeletal tracks'
do
    if ! grep -Fq "$provenance_entry" "$repository_root/PROVENANCE.md"; then
        printf 'PROVENANCE.md lacks VRMA entry: %s\n' "$provenance_entry" >&2
        exit 1
    fi
done

if ! MILLER_AVATAR_WEB_SKIP_INSTALL=1 \
    "$repository_root/scripts/bundle-web.sh" >"$temporary_root/bundle.out" 2>"$temporary_root/bundle.err"; then
    cat "$temporary_root/bundle.out" "$temporary_root/bundle.err" >&2
    printf 'bundle-web did not select the exact release toolchain\n' >&2
    exit 1
fi
find "$repository_root/Sources/MillerAvatarHost/Resources/Web" -type f -print0 |
    LC_ALL=C sort -z | xargs -0 shasum -a 256 > "$temporary_root/web-hashes-a.txt"
if ! MILLER_AVATAR_WEB_SKIP_INSTALL=1 \
    "$repository_root/scripts/bundle-web.sh" >"$temporary_root/bundle-second.out" 2>"$temporary_root/bundle-second.err"
then
    cat "$temporary_root/bundle-second.out" "$temporary_root/bundle-second.err" >&2
    printf 'second deterministic web bundle build failed\n' >&2
    exit 1
fi
find "$repository_root/Sources/MillerAvatarHost/Resources/Web" -type f -print0 |
    LC_ALL=C sort -z | xargs -0 shasum -a 256 > "$temporary_root/web-hashes-b.txt"
cmp "$temporary_root/web-hashes-a.txt" "$temporary_root/web-hashes-b.txt"
bundle_before=$(shasum -a 256 "$repository_root/Sources/MillerAvatarHost/Resources/Web/bundle-manifest.json" | awk '{print $1}')
if MILLER_AVATAR_SIMULATE_BUNDLE_FAILURE=1 \
    MILLER_AVATAR_WEB_SKIP_INSTALL=1 \
    "$repository_root/scripts/bundle-web.sh" >"$temporary_root/bundle-failure.out" 2>"$temporary_root/bundle-failure.err"
then
    printf 'simulated web bundle failure unexpectedly succeeded\n' >&2
    exit 1
fi
bundle_after=$(shasum -a 256 "$repository_root/Sources/MillerAvatarHost/Resources/Web/bundle-manifest.json" | awk '{print $1}')
test "$bundle_before" = "$bundle_after"
if find "$repository_root/.generated" -maxdepth 1 -type d -name 'web-stage.*' -print -quit | grep -q .; then
    printf 'failed web bundle left a stage directory behind\n' >&2
    exit 1
fi
if grep -R -n -E '/Users/|/private/var/|MILLER_AVATAR_PRIVATE_FIXTURE_ROOT' "$repository_root/.generated"; then
    printf 'bundle-web retained a private path in generated output\n' >&2
    exit 1
fi

copy_root="$temporary_root/repository"
rsync -a \
    --exclude .git \
    --exclude .build \
    --exclude .generated \
    --exclude Web/node_modules \
    "$repository_root/" "$copy_root/"
if [[ -d "$repository_root/Web/node_modules" ]]; then
    rsync -a "$repository_root/Web/node_modules/" "$copy_root/Web/node_modules/"
fi

remote_url_output="$temporary_root/remote-url-verifier.out"
original_app="$temporary_root/original-app.js"
cp "$copy_root/Sources/MillerAvatarHost/Resources/Web/app.js" "$original_app"
for remote_scheme in http https ws wss; do
    cp "$original_app" "$copy_root/Sources/MillerAvatarHost/Resources/Web/app.js"
    printf '\nconst rejectedRemoteURL = "%s://example.invalid/probe";\n' "$remote_scheme" \
        >> "$copy_root/Sources/MillerAvatarHost/Resources/Web/app.js"
    if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" >"$remote_url_output" 2>&1; then
        printf 'dependency verifier accepted complete %s:// URL literal\n' "$remote_scheme" >&2
        exit 1
    fi
    if ! grep -Fq 'complete remote URL literal' "$remote_url_output"; then
        cat "$remote_url_output" >&2
        printf 'dependency verifier did not reject complete %s:// URL literal explicitly\n' "$remote_scheme" >&2
        exit 1
    fi
done
cp "$original_app" "$copy_root/Sources/MillerAvatarHost/Resources/Web/app.js"

"$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root"

esbuild_binary="$copy_root/Web/node_modules/@esbuild/darwin-arm64/bin/esbuild"
esbuild_mode=$(stat -f %Lp "$esbuild_binary")
chmod a-x "$esbuild_binary"
if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" --skip-bundle >/dev/null 2>&1; then
    chmod "$esbuild_mode" "$esbuild_binary"
    printf 'dependency verifier accepted a non-executable esbuild binary\n' >&2
    exit 1
fi
chmod "$esbuild_mode" "$esbuild_binary"

(
    trap 'chmod "$esbuild_mode" "$esbuild_binary"' EXIT
    chmod u-x,g+x,o+x "$esbuild_binary"
    if test -x "$esbuild_binary"; then
        printf 'current user can execute an owner-non-executable esbuild binary\n' >&2
        exit 1
    fi
    if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" --skip-bundle >/dev/null 2>&1; then
        printf 'dependency verifier accepted an owner-non-executable esbuild binary\n' >&2
        exit 1
    fi
)

cp "$esbuild_binary" "$temporary_root/esbuild.original"
printf '\n' >> "$esbuild_binary"
if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" --skip-bundle >/dev/null 2>&1; then
    cp "$temporary_root/esbuild.original" "$esbuild_binary"
    chmod "$esbuild_mode" "$esbuild_binary"
    printf 'dependency verifier accepted a byte-tampered esbuild binary\n' >&2
    exit 1
fi
cp "$temporary_root/esbuild.original" "$esbuild_binary"
chmod "$esbuild_mode" "$esbuild_binary"

printf 'not a real screenshot\n' > "$copy_root/docs/rejected-screenshot.png"
if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" --skip-bundle >/dev/null 2>&1; then
    rm -f "$copy_root/docs/rejected-screenshot.png"
    printf 'dependency verifier accepted a prohibited screenshot outside Fixtures\n' >&2
    exit 1
fi
rm -f "$copy_root/docs/rejected-screenshot.png"

rm -rf -- "$copy_root/Web/node_modules"
mkdir "$copy_root/Web/node_modules"
if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" --skip-bundle >/dev/null 2>&1; then
    printf 'dependency verifier accepted a missing required installed package tree\n' >&2
    exit 1
fi
rm -rf "$copy_root/Web/node_modules"

cp "$copy_root/Web/package.json" "$temporary_root/package.json"
"$node_command" --input-type=module - "$copy_root/Web/package.json" <<'NODE'
import { readFileSync, writeFileSync } from "node:fs";
const path = process.argv[2];
const manifest = JSON.parse(readFileSync(path, "utf8"));
manifest.dependencies.three = "^0.180.0";
writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
NODE
if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" --skip-bundle >/dev/null 2>&1; then
    printf 'dependency verifier accepted a version range\n' >&2
    exit 1
fi
mv "$temporary_root/package.json" "$copy_root/Web/package.json"

cp "$copy_root/Web/package-lock.json" "$temporary_root/package-lock.json"
"$node_command" --input-type=module - "$copy_root/Web/package-lock.json" <<'NODE'
import { readFileSync, writeFileSync } from "node:fs";
const path = process.argv[2];
const lock = JSON.parse(readFileSync(path, "utf8"));
lock.packages["node_modules/@esbuild/unauthorized-platform"] = {
  version: "0.28.1",
  resolved: "https://registry.npmjs.org/@esbuild/unauthorized-platform/-/unauthorized-platform-0.28.1.tgz",
  integrity: "sha512-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
  license: "MIT",
};
writeFileSync(path, `${JSON.stringify(lock, null, 2)}\n`);
NODE
if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" --skip-bundle >/dev/null 2>&1; then
    printf 'dependency verifier accepted an unauthorized package-family member\n' >&2
    exit 1
fi
mv "$temporary_root/package-lock.json" "$copy_root/Web/package-lock.json"

cp "$copy_root/Resources/build-manifest.json" "$temporary_root/build-manifest.json"
"$node_command" --input-type=module - "$copy_root/Resources/build-manifest.json" <<'NODE'
import { readFileSync, writeFileSync } from "node:fs";
const path = process.argv[2];
const manifest = JSON.parse(readFileSync(path, "utf8"));
manifest.files.push({
  path: "Contents/MacOS/MillerAvatarApp",
  byte_count: 1,
  sha256: "0".repeat(64),
});
writeFileSync(path, `${JSON.stringify(manifest)}\n`);
NODE
if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" >/dev/null 2>&1; then
    printf 'dependency verifier accepted a machine-specific executable output hash\n' >&2
    exit 1
fi
mv "$temporary_root/build-manifest.json" "$copy_root/Resources/build-manifest.json"

printf '//# sourceMappingURL=private.map\n' >> "$copy_root/Sources/MillerAvatarHost/Resources/Web/app.js"
if "$node_command" "$copy_root/Web/scripts/verify-dependencies.mjs" --repository-root "$copy_root" >/dev/null 2>&1; then
    printf 'dependency verifier accepted a source map reference\n' >&2
    exit 1
fi

printf 'release-discipline rejection contracts passed\n'
