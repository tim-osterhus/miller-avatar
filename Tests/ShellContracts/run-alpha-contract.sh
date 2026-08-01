#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd -P)
test_root=$(mktemp -d "${TMPDIR:-/tmp}/miller-avatar-run-alpha.XXXXXX")
cleanup() {
    if [[ -n ${host_pid:-} ]] && kill -0 "$host_pid" 2>/dev/null; then
        kill "$host_pid" 2>/dev/null || true
        wait "$host_pid" 2>/dev/null || true
    fi
    rm -rf -- "$test_root"
}
trap cleanup EXIT

mkdir -p "$test_root/scripts"
cp "$repo_root/scripts/run-alpha.sh" "$test_root/scripts/run-alpha.sh"
chmod +x "$test_root/scripts/run-alpha.sh"

if "$test_root/scripts/run-alpha.sh" >"$test_root/missing.out" 2>"$test_root/missing.err"; then
    printf 'run-alpha unexpectedly succeeded without a built app\n' >&2
    exit 1
fi
if [[ -d "$test_root/.generated" ]]; then
    printf 'run-alpha created generated output instead of failing closed\n' >&2
    exit 1
fi

app="$test_root/.generated/Miller Avatar Alpha.app"
executable="$app/Contents/MacOS/MillerAvatarApp"
mkdir -p "$(dirname -- "$executable")"
cat > "$executable" <<'SCRIPT'
#!/bin/bash
exec sleep 30
SCRIPT
chmod +x "$executable"

host_pid=$("$test_root/scripts/run-alpha.sh")
if [[ ! "$host_pid" =~ ^[0-9]+$ ]] || ! kill -0 "$host_pid" 2>/dev/null; then
    printf 'run-alpha did not print a live host PID\n' >&2
    exit 1
fi

printf 'run-alpha contract passed\n'
