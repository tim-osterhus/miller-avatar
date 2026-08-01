#!/bin/bash

set -u

expected_clt="Command Line Tools 16.4.0.0.1.1747106510"
expected_swift="Apple Swift 6.1.2"
expected_clang="Apple Clang 17.0.0"
expected_sdk="macOS SDK 15.5"
expected_arch="arm64"

clt_version=$(
    pkgutil --pkg-info=com.apple.pkg.CLTools_Executables 2>/dev/null |
        awk '$1 == "version:" { print $2; exit }'
)
swift_version=$(
    swift --version 2>/dev/null |
        sed -n 's/.*Apple Swift version \([0-9][0-9.]*\).*/\1/p' |
        head -n 1
)
clang_version=$(
    clang --version 2>/dev/null |
        sed -n 's/Apple clang version \([0-9][0-9.]*\).*/\1/p' |
        head -n 1
)
sdk_version=$(xcrun --sdk macosx --show-sdk-version 2>/dev/null)
architecture=$(uname -m)

observed_clt="Command Line Tools ${clt_version:-unavailable}"
observed_swift="Apple Swift ${swift_version:-unavailable}"
observed_clang="Apple Clang ${clang_version:-unavailable}"
observed_sdk="macOS SDK ${sdk_version:-unavailable}"
observed_arch="${architecture:-unavailable}"

printf '%s\n' "$observed_clt"
printf '%s\n' "$observed_swift"
printf '%s\n' "$observed_clang"
printf '%s\n' "$observed_sdk"
printf '%s\n' "$observed_arch"

status=0
for comparison in \
    "$observed_clt|$expected_clt" \
    "$observed_swift|$expected_swift" \
    "$observed_clang|$expected_clang" \
    "$observed_sdk|$expected_sdk" \
    "$observed_arch|$expected_arch"
do
    observed=${comparison%%|*}
    expected=${comparison#*|}
    if [[ "$observed" != "$expected" ]]; then
        printf 'expected %s, observed %s\n' "$expected" "$observed" >&2
        status=1
    fi
done

exit "$status"
