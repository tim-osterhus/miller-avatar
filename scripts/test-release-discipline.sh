#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
generated_root="$repo_root/.generated"
output_app="$generated_root/Miller Avatar Alpha.app"
receipt="$generated_root/Miller Avatar Alpha.post-sign.json"
temporary_root=$(mktemp -d "${TMPDIR:-/tmp}/miller-avatar-release-discipline.XXXXXX")
build_a="$temporary_root/build-a"
build_b="$temporary_root/build-b"
build_interrupted="$temporary_root/build-interrupted"
build_toolchain_failure="$temporary_root/build-toolchain-failure"
build_swift_failure="$temporary_root/build-swift-failure"
build_assembly_failure="$temporary_root/build-assembly-failure"
build_codesign_failure="$temporary_root/build-codesign-failure"
sentinel="$temporary_root/keep.txt"
preserved_node_modules="$temporary_root/node_modules"
printf 'keep\n' > "$sentinel"
pinned_node=/opt/homebrew/Cellar/node@22/22.22.0/bin/node
if [[ -x "$pinned_node" ]]; then
    node_command=$pinned_node
else
    node_command=$(command -v node || true)
fi
if [[ -z "$node_command" ]] || [[ $("$node_command" --version) != "v22.22.0" ]]; then
    printf 'Node 22.22.0 is required for release-discipline verification\n' >&2
    exit 1
fi
test -d "$repo_root/Sources/MillerAvatarHost/Resources/Web"
test ! -e "$repo_root/Resources/Web"

remove_test_root() {
    local target=$1
    local attempt
    for attempt in 1 2 3; do
        [[ -e "$target" || -L "$target" ]] || return 0
        rm -rf -- "$target" 2>/dev/null || true
    done
    printf 'could not remove test-owned root: %s\n' "$target" >&2
    return 1
}

cleanup() {
    local status=$?
    trap - EXIT
    if [[ -d "$preserved_node_modules" && ! -e "$repo_root/Web/node_modules" ]]; then
        mv "$preserved_node_modules" "$repo_root/Web/node_modules" || status=1
    fi
    remove_test_root "$generated_root" || status=1
    remove_test_root "$temporary_root" || status=1
    exit "$status"
}
trap cleanup EXIT

shared_cache_roots=("${HOME:-}/Library/Developer/Xcode/DerivedData/ModuleCache.noindex")
darwin_user_cache=$(getconf DARWIN_USER_CACHE_DIR 2>/dev/null || true)
if [[ -n "$darwin_user_cache" ]]; then
    shared_cache_roots+=("${darwin_user_cache%/}/clang/ModuleCache")
fi
cache_before="$temporary_root/shared-cache-before.txt"
cache_after="$temporary_root/shared-cache-after.txt"
snapshot_cache() {
    local destination=$1
    local shared_cache
    : > "$destination"
    for shared_cache in "${shared_cache_roots[@]}"; do
        printf 'root\t%s\n' "$shared_cache" >> "$destination"
        if [[ -d "$shared_cache" ]]; then
            (
                cd "$shared_cache"
                find . -type f -print | LC_ALL=C sort |
                    while IFS= read -r path; do shasum -a 256 "$path"; done
            ) >> "$destination"
        else
            printf 'absent\n' >> "$destination"
        fi
    done
}

snapshot_cache "$cache_before"
"$repo_root/scripts/build.sh" "$build_a"
test ! -e "$output_app/Contents/Resources/Web"
test -d "$output_app/Contents/Resources/MillerAvatar_MillerAvatarHost.bundle/Web"
cp "$repo_root/Resources/build-manifest.json" "$temporary_root/build-manifest-a.json"
cp "$receipt" "$temporary_root/post-sign-a.json"

"$node_command" --input-type=module - \
    "$temporary_root/build-manifest-a.json" \
    "$temporary_root/post-sign-a.json" <<'NODE'
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const manifestBytes = readFileSync(process.argv[2]);
const manifest = JSON.parse(manifestBytes.toString("utf8"));
const receipt = JSON.parse(readFileSync(process.argv[3], "utf8"));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

assert.deepEqual(manifest.product, {
  name: "Miller Avatar Alpha",
  bundle_identifier: "ai.millrace.miller-avatar.alpha",
  short_version: "0.0.1",
  build_version: "1",
  deployment_target: "15.0",
});
assert.match(manifest.source_revision, /^[0-9a-f]{40}$/u);
assert.match(manifest.executable_input_sha256, /^[0-9a-f]{64}$/u);
assert.match(manifest.web_bundle_manifest_sha256, /^[0-9a-f]{64}$/u);
assert.equal(receipt.pre_sign_manifest_sha256, sha256(manifestBytes));
NODE

for legal_file in LICENSE NOTICE THIRD_PARTY_NOTICES.md; do
    cmp "$repo_root/$legal_file" "$output_app/Contents/Resources/Legal/$legal_file"
done

assert_failed_build() {
    local stage=$1
    local private_root=$2
    local before_hash
    local after_hash
    before_hash=$(shasum -a 256 "$output_app/Contents/MacOS/MillerAvatarApp" | awk '{print $1}')
    if MILLER_AVATAR_SIMULATE_FAILURE_STAGE="$stage" \
        "$repo_root/scripts/build.sh" "$private_root"
    then
        printf 'simulated %s failure unexpectedly succeeded\n' "$stage" >&2
        exit 1
    fi
    after_hash=$(shasum -a 256 "$output_app/Contents/MacOS/MillerAvatarApp" | awk '{print $1}')
    test "$before_hash" = "$after_hash"
    test ! -e "$generated_root/.logical-build-root"
    if find "$private_root" -maxdepth 1 -type d -name '.run.*' -print -quit | grep -q .; then
        printf 'simulated %s failure left a run directory behind\n' "$stage" >&2
        exit 1
    fi
}

assert_failed_build toolchain "$build_toolchain_failure"
assert_failed_build swift "$build_swift_failure"
assert_failed_build assembly "$build_assembly_failure"
assert_failed_build codesign "$build_codesign_failure"

"$repo_root/scripts/test-publication-rollback.sh"

"$repo_root/scripts/build.sh" "$build_b"
cmp "$temporary_root/build-manifest-a.json" "$repo_root/Resources/build-manifest.json"
"$node_command" --input-type=module - \
    "$temporary_root/post-sign-a.json" \
    "$receipt" <<'NODE'
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const first = JSON.parse(readFileSync(process.argv[2], "utf8"));
const second = JSON.parse(readFileSync(process.argv[3], "utf8"));
for (const key of ["schema", "pre_sign_manifest_sha256", "executable"]) {
  assert.deepEqual(second[key], first[key], `post-sign deterministic field differs: ${key}`);
}
assert.match(first.app_tree_sha256, /^[0-9a-f]{64}$/u);
assert.match(second.app_tree_sha256, /^[0-9a-f]{64}$/u);
NODE

before_interrupt_hash=$(shasum -a 256 "$output_app/Contents/MacOS/MillerAvatarApp" | awk '{print $1}')
if MILLER_AVATAR_SIMULATE_INTERRUPT=1 "$repo_root/scripts/build.sh" "$build_interrupted"; then
    printf 'interrupted build unexpectedly succeeded\n' >&2
    exit 1
fi
after_interrupt_hash=$(shasum -a 256 "$output_app/Contents/MacOS/MillerAvatarApp" | awk '{print $1}')
test "$before_interrupt_hash" = "$after_interrupt_hash"
test ! -e "$generated_root/.logical-build-root"
if find "$build_interrupted" -maxdepth 1 -type d -name '.run.*' -print -quit | grep -q .; then
    printf 'interrupted build left a run directory behind\n' >&2
    exit 1
fi

manifest_hash=$(shasum -a 256 "$repo_root/Resources/build-manifest.json" | awk '{print $1}')
app_manifest_hash=$(shasum -a 256 "$output_app/Contents/Resources/build-manifest.json" | awk '{print $1}')
test "$manifest_hash" = "$app_manifest_hash"

mv "$repo_root/Web/node_modules" "$preserved_node_modules"
"$repo_root/scripts/clean.sh" "$build_a"
"$repo_root/scripts/clean.sh" "$build_b"
"$repo_root/scripts/clean.sh" "$build_interrupted"
"$repo_root/scripts/clean.sh" "$build_toolchain_failure"
"$repo_root/scripts/clean.sh" "$build_swift_failure"
"$repo_root/scripts/clean.sh" "$build_assembly_failure"
"$repo_root/scripts/clean.sh" "$build_codesign_failure"
"$repo_root/scripts/clean.sh"
"$repo_root/scripts/clean.sh"
test ! -e "$generated_root"
test ! -e "$repo_root/Web/.build"
test ! -e "$build_a"
test ! -e "$build_b"
test ! -e "$build_interrupted"
test ! -e "$build_toolchain_failure"
test ! -e "$build_swift_failure"
test ! -e "$build_assembly_failure"
test ! -e "$build_codesign_failure"
test "$(cat "$sentinel")" = keep
mv "$preserved_node_modules" "$repo_root/Web/node_modules"

snapshot_cache "$cache_after"
cmp "$cache_before" "$cache_after"

printf 'deterministic build, rollback, cache, and cleanup contracts passed\n'
