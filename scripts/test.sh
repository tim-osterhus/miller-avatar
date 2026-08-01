#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
build_root=${MILLER_AVATAR_TEST_ROOT:-"$repo_root/.build/tests"}
mkdir -p "$build_root"
build_root=$(CDPATH= cd -- "$build_root" && pwd -P)

clang_cache="$build_root/module-cache/clang"
swift_cache="$build_root/module-cache/swift"
scratch_path="$build_root/swiftpm"
mkdir -p "$clang_cache" "$swift_cache" "$scratch_path"

if [[ ${1:-all} == contracts ]]; then
    (
        cd "$repo_root/Web"
        npm run toolchain:check
    )
    PATH="$PATH:/usr/sbin" "$repo_root/scripts/verify-toolchain.sh"
    CLANG_MODULE_CACHE_PATH="$clang_cache" \
    SWIFT_MODULECACHE_PATH="$swift_cache" \
        swift test \
        --package-path "$repo_root" \
        --scratch-path "$scratch_path" \
        -Xcc "-fmodules-cache-path=$clang_cache" \
        -Xswiftc -module-cache-path \
        -Xswiftc "$swift_cache" \
        --filter BridgeContractTests
    (
        cd "$repo_root/Web"
        npm run test:contract
    )
    exit 0
fi

PATH="$PATH:/usr/sbin" "$repo_root/scripts/verify-toolchain.sh"

CLANG_MODULE_CACHE_PATH="$clang_cache" \
SWIFT_MODULECACHE_PATH="$swift_cache" \
    swift test \
    --package-path "$repo_root" \
    --scratch-path "$scratch_path" \
    -Xcc "-fmodules-cache-path=$clang_cache" \
    -Xswiftc -module-cache-path \
    -Xswiftc "$swift_cache"

"$repo_root/scripts/test-publication-rollback.sh"
"$repo_root/Tests/ShellContracts/run-alpha-contract.sh"
