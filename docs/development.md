# Development

Miller Avatar requires the pinned Command Line Tools toolchain; full Xcode is
not required.

```bash
scripts/verify-toolchain.sh
swift test
scripts/test.sh
scripts/build.sh
codesign --verify --deep --strict ".generated/Miller Avatar Alpha.app"
scripts/clean.sh
```

## Committed bundle and clean builds

`Resources/Web/` is the committed offline web bundle. Clean Swift tests and
app builds do not regenerate it and do not require Node, npm, `Web/node_modules/`,
or an npm cache. They consume repository resources as committed.

The current standalone-alpha app has not yet wired native-host bridge
transport or the live renderer. A clean app build therefore does not prove
that the web bundle can be regenerated from a clean checkout.

`scripts/test.sh contracts` is different from the normal Swift test path. It
runs the TypeScript contract suite and requires the exact web dependencies.

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

`MILLER_AVATAR_WEB_SKIP_INSTALL=1` is valid only when an audited
`Web/node_modules/` tree has already been restored from the same lockfile. The
mode verifies that tree and does not install or mutate dependencies. It is not
a clean-checkout regeneration path.

`Resources/Web/bundle-manifest.json` uses the v2 contract. Each payload file
records its MIME type, byte count, and SHA-256. Each build input records its
byte count and SHA-256. The deterministic `contract_sha256` covers the manifest
contract without attempting the impossible self-hash of the manifest bytes.

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
