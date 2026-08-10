# Development

Miller Avatar is a reusable offline Swift package plus a thin standalone
diagnostic app, not a bundled assistant or asset pack. It requires the pinned
Command Line Tools toolchain; full Xcode is not required. Miller source
integration is explicitly deferred, and this tranche does not edit Miller.

```bash
scripts/verify-toolchain.sh
scripts/test.sh contracts
scripts/test.sh
scripts/verify-dependencies.sh
scripts/build.sh
scripts/run-alpha.sh
codesign --verify --deep --strict ".generated/Miller Avatar Alpha.app"
codesign -d --entitlements :- ".generated/Miller Avatar Alpha.app"
scripts/test-signed-boundary.sh ".generated/Miller Avatar Alpha.app"
scripts/clean.sh
```

`scripts/test.sh contracts` is the narrow cross-language bridge contract path.
Plain `scripts/test.sh` is the complete public automated gate. `scripts/build.sh`
assembles `.generated/Miller Avatar Alpha.app`; `scripts/run-alpha.sh` starts
that already-built diagnostic app and prints its process ID. The signed-boundary
command accepts an optional app-bundle path.

## Package and integration boundary

The caller owns session/request correlation and generation, playback, projection,
and cue identity values. The package validates the payloads and fences stale
renderer callbacks; its internal renderer session UUID is only a lifecycle
fencing value, not Miller session state. `AvatarSurfaceController` is the public
`@MainActor` surface: embed `view`, call `start()` after installation, pass only
`AdmittedAsset` values to `load(_:)`, observe `onObservation` or `onSnapshot`,
and call idempotent `dispose(reason:)` during teardown. The surface is
noninteractive. `MillerAvatarApp` consumes this API for diagnostics and is not
an alternate renderer or host implementation.

The package bundles no default model, VRMA, animation pack, model cache, or
user-file copy, and has no network runtime dependency. User-supplied assets
remain separate from the package and are admitted from bounded in-memory bytes.
No Miller integration or manual visual, signing, or release qualification result
is claimed by these development instructions.

## Committed bundle and clean builds

`Sources/MillerAvatarHost/Resources/Web/` is the committed offline web bundle.
The `MillerAvatarHost` SwiftPM target owns exactly one renderer resource bundle,
`MillerAvatar_MillerAvatarHost.bundle`. An assembled app resolves that fixed
bundle under `Contents/Resources/`; ordinary SwiftPM use falls back to
`Bundle.module`. App builds consume the committed bundle and do not regenerate
it. Runtime execution requires neither Node nor npm. The complete public test
gate requires the exact Node/npm toolchain and an installed dependency tree so
it can run web tests and verify provenance.

The web bundle includes the exact runtime dependency
`@pixiv/three-vrm-animation@3.5.5`. The bundle contains the Pixiv animation
module and Miller's `motion-loader.ts` and `motion-controller.ts` inputs. It
contains no motion or model asset.

The assembled standalone-alpha app wires native-host bridge transport and its
production web bootstrap into the signed bundle. `scripts/test-signed-boundary.sh`
starts that freshly signed bundle and requires wrapper and renderer readiness;
it also checks the exact entitlement set and rejects fault hooks and private
model fixtures. A clean app build still does not prove that the web bundle can
be regenerated from a clean checkout.

The signed app retains `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`
byte-for-byte under `Contents/Resources/Legal/`. The native build manifest
hashes those source and embedded files, and release verification rejects a
missing, renamed, stale, or changed legal file.

`scripts/clean.sh` removes repository-owned native output, compiled web-test
output, installed web dependencies, and declared build staging roots. It does
not remove committed web resources, user assets, or shared system caches.

`AvatarProfileStore` is optional local persistence for profile metadata in
`profiles-v2.json`. It reads `profiles-v1.json` only for migration. It stores a
security-scoped bookmark and digest metadata, not a source path or copied model.
Import and load re-capture, re-admit, and revalidate the digest. The owner-only
root and file use modes `0700` and `0600`; three consecutive load or renderer
failures quarantine a profile, and recovery requires an explicit success reset
or reselection. Removing a profile preserves the original user file.

## Maintainer-only bundle regeneration

Bundle regeneration is not a clean-checkout npm workflow. It requires Node
22.22.0, npm 10.9.4, and an audited pre-populated cache at
`.generated/web-npm-cache/`. The cache must match the integrity entries in
`Web/package-lock.json`. Do not run the regeneration commands when that cache
is absent or incomplete.

After the approved cache is present, use:

```bash
export PATH=/opt/homebrew/Cellar/node@22/22.22.0/bin:$PATH
cd Web
npm ci --offline --ignore-scripts --no-audit --no-fund
npm run dependencies:check
npm test
npm run typecheck
cd ..
scripts/test.sh contracts
MILLER_AVATAR_WEB_SKIP_INSTALL=1 scripts/bundle-web.sh
```

`Web/.npmrc` enforces the exact engine, disables lifecycle scripts, and forces
offline/no-audit/no-fund behavior. `npm ci --offline` fails on a cache miss. It
must never fall back to the registry.

`scripts/bundle-web.sh` checks the toolchain before dependency restoration. It
verifies the pinned `@esbuild/darwin-arm64` 0.28.1 executable and invokes that
binary directly. It replaces `Sources/MillerAvatarHost/Resources/Web/` only
after every staging check passes.

When the exact installed esbuild binary is present, `scripts/bundle-web.sh`
automatically uses the installed dependency tree. Otherwise it performs the
offline `npm ci` restoration. `MILLER_AVATAR_WEB_SKIP_INSTALL=1` is valid only
when an audited
`Web/node_modules/` tree has already been restored from the same lockfile. The
mode verifies that tree and does not install or mutate dependencies. It is not
a clean-checkout regeneration path.

For source-and-bundle closure, rebuild twice with the pinned toolchain and
compare SHA-256 records for every file under the committed Web resource root:

```bash
qa_root=$(mktemp -d)
trap 'rm -rf -- "$qa_root"' EXIT
MILLER_AVATAR_WEB_SKIP_INSTALL=1 scripts/bundle-web.sh
find Sources/MillerAvatarHost/Resources/Web -type f -print0 |
  LC_ALL=C sort -z | xargs -0 shasum -a 256 > "$qa_root/first.sha256"
MILLER_AVATAR_WEB_SKIP_INSTALL=1 scripts/bundle-web.sh
find Sources/MillerAvatarHost/Resources/Web -type f -print0 |
  LC_ALL=C sort -z | xargs -0 shasum -a 256 > "$qa_root/second.sha256"
cmp "$qa_root/first.sha256" "$qa_root/second.sha256"
```

The bundle verifier rejects source maps, remote runtime URLs, AIRI references,
private paths or metadata, author metadata in normalized manifests, and model
or motion assets. The HTML CSP remains network-closed.

`Sources/MillerAvatarHost/Resources/Web/bundle-manifest.json` uses the v2
contract. Each payload file records its MIME type, byte count, and SHA-256. Each
build input records its byte count and SHA-256. The deterministic
`contract_sha256` covers the manifest contract without attempting the impossible
self-hash of the manifest bytes.

`Resources/build-manifest.json` is the deterministic pre-sign receipt. It
records fixed product/toolchain identity, the executable-input hash, and every
portable resource hash while excluding itself, compiled executable output, and
`_CodeSignature`. The build writes
`.generated/Miller Avatar Alpha.post-sign.json` outside the app; that receipt
records the pre-sign manifest hash and hashes the signed executable and sorted
signed app tree, so it cannot include itself. The reproducibility check compares
only receipt fields unaffected by ad-hoc signature bytes across two separate
private build roots.

`scripts/build.sh` defaults to the repository-owned
`.generated/private-build/` root. Pass a new absolute private directory as its
only argument when isolation outside the repository is required. A previously
created external root is accepted only when it already carries the build
harness ownership marker. The same directory may be passed to
`scripts/clean.sh`; cleanup accepts it only when that marker is present.

Generated roots removed by `scripts/clean.sh` are `.build/`, `.generated/`
(including `private-build/` and `web-npm-cache/`), and `Web/node_modules/`.
It also removes `Web/.build/`. An external private build root may be passed to
`scripts/clean.sh` only when it is an existing absolute directory marked by
`scripts/build.sh`. Cleanup does not remove committed
`Sources/MillerAvatarHost/Resources/Web/` or `Resources/Static/`.
After cleanup, bundle regeneration remains blocked until the audited npm cache
or audited `Web/node_modules/` tree is restored.
