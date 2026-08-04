# Development

Miller Avatar requires the pinned Command Line Tools toolchain; full Xcode is
not required.

```bash
scripts/verify-toolchain.sh
scripts/test.sh
scripts/verify-dependencies.sh
scripts/bundle-web.sh
scripts/build.sh
codesign --verify --deep --strict ".generated/Miller Avatar Alpha.app"
codesign -d --entitlements :- ".generated/Miller Avatar Alpha.app"
scripts/test-signed-boundary.sh ".generated/Miller Avatar Alpha.app"
scripts/clean.sh
```

## Committed bundle and clean builds

`Resources/Web/` is the committed offline web bundle. App builds consume it as
committed and do not regenerate it. Runtime execution requires neither Node nor
npm. The complete public test gate requires the exact Node/npm toolchain and an
installed dependency tree so it can run web tests and verify provenance.

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

`scripts/test.sh contracts` is the narrow cross-language bridge contract path.
Plain `scripts/test.sh` is the complete public automated gate: Swift and web
tests, type checking, dependency/resource verification, shell safety contracts,
double-build determinism, rollback, signed hash scopes, cleanup, and shared
module-cache isolation.

`scripts/clean.sh` removes repository-owned native output, compiled web-test
output, installed web dependencies, and declared build staging roots. It does
not remove committed web resources, user assets, or shared system caches.

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
binary directly. It replaces `Resources/Web/` only after every staging check
passes.

When the exact installed esbuild binary is present, `scripts/bundle-web.sh`
automatically uses the installed dependency tree. Otherwise it performs the
offline `npm ci` restoration. `MILLER_AVATAR_WEB_SKIP_INSTALL=1` is valid only
when an audited
`Web/node_modules/` tree has already been restored from the same lockfile. The
mode verifies that tree and does not install or mutate dependencies. It is not
a clean-checkout regeneration path.

`Resources/Web/bundle-manifest.json` uses the v2 contract. Each payload file
records its MIME type, byte count, and SHA-256. Each build input records its
byte count and SHA-256. The deterministic `contract_sha256` covers the manifest
contract without attempting the impossible self-hash of the manifest bytes.

`Resources/build-manifest.json` is the deterministic pre-sign receipt. It
records fixed product/toolchain identity plus every executable and resource
hash while excluding itself and `_CodeSignature`. The build writes
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
Cleanup does not remove committed `Resources/Web/` or `Resources/Static/`.
After cleanup, bundle regeneration remains blocked until the audited npm cache
or audited `Web/node_modules/` tree is restored.
