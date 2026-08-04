# Provenance policy

Miller Avatar is a clean-room repository. It does not inherit source, tests,
assets, or Git history from Cortana Assistant, VoiceInk, the private Cortana
avatar, or any prospective donor project. User-selected avatars are runtime
inputs: they are held in memory, are not redistributed, and are not covered by
this repository's Apache-2.0 license.

`Resources/Static/MillerAvatarFallback.svg` is first-party artwork authored for
Miller Avatar. No model, motion, texture, font, sound, decoder binary,
WebAssembly module, screenshot, or private fixture is distributed.

## First-party research adaptation ledger

The production implementation retained behavioral findings from the local D9
research program, but it did not promote the research spike into shipping
source. Rewritten; no research-spike source file was copied into the public repository.

- `Sources/MillerAvatarApp/`, `Sources/MillerAvatarHost/`, and their AppKit and
  host tests were informed by
  `lab/assist/research/spikes/macos-popup-webview-visible/`. The production
  rewrite retained a native owner, a local custom-scheme WebKit surface,
  closed navigation, static fallback, explicit focus traversal, isolated build
  caches, and deterministic teardown. It removed the spike's research UI,
  evidence log, operator-recovery controls, process probes, private-fixture
  wiring, and experimental approval gates. App, host, scheme, navigation,
  teardown, window-policy, signed-boundary, and shell-contract tests protect
  the retained assumptions.
- `Sources/MillerAvatarCore/`, `Web/src/bridge.ts`, `Web/src/contract.ts`,
  `Web/src/lifecycle.ts`, `Web/src/presentation.ts`, and their contract tests
  were informed by `lab/assist/research/spikes/avatar-contract-oracle/`. The
  production rewrite retained strict sequencing, generation/playback fencing,
  bounded messages, presentation-only authority, and fail-closed lifecycle
  transitions. It removed the Python oracle runtime and made the Swift and
  TypeScript implementations independently test the shared JSON fixtures.
- `Web/src/renderer.ts`, `Web/src/runtime.ts`, `Web/src/camera.ts`, and their
  tests were informed by the visible-render experiments beneath
  `lab/assist/research/spikes/macos-popup-webview-visible/`. The production
  rewrite retained VRM 1.0 framing, MToon presentation, expressions, gaze,
  spring-bone updates, suspension, and deterministic disposal. It removed
  diagnostic controls, screenshot capture, hard-coded fixture assumptions,
  external navigation, and research evidence transport. Renderer, camera,
  bootstrap, disposal, and containment tests protect the retained behavior.
- `scripts/build.sh`, `scripts/clean.sh`, and the shell contracts retained the
  spike lesson that compiler contexts and caches must be run-private. The
  production scripts use declared ownership markers and stable logical paths;
  they exclude randomized debug-prefix inputs, research evidence archives, and
  system-cache cleanup. Build-root, clean-root, rollback, interruption, and
  shared-cache comparisons protect that boundary.

Generated `Resources/Web/` files come only from `scripts/bundle-web.sh` and the
exact locked npm graph. `Resources/build-manifest.json` comes only from
`scripts/build.sh`. Their normalized manifests identify and hash the source
inputs; neither generated tree contains research assets or private fixtures.

## Machine-readable authority

`Web/package-lock.json` is the complete npm resolution authority. It contains
63 locked package records. Every record has an exact version, HTTPS npm registry
artifact URL, SHA-512 integrity, and SPDX license. Its SHA-256 is
`666c5cf8e4319b680a5b9c6c3b08bae20c580888b214a8ff3df96938c243a3e8`.
`scripts/verify-dependencies.sh` rejects missing or additional records, version
ranges, changed integrity or license data, unapproved lifecycle scripts, and
installed-tree drift.

`Resources/Web/bundle-metafile.json` names every source that contributes bytes
to `app.js`. `Resources/Web/bundle-manifest.json` hashes those inputs and every
emitted payload. The manifest uses a canonical contract hash and excludes its
own bytes. `Resources/build-manifest.json` records the native toolchain, product
identity, pre-sign executable, and resource hashes; it excludes itself and all
code-signature artifacts. The external post-sign receipt covers the signed
executable and signed app tree, so neither hash scope is circular.

The signed app retains `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`
byte-for-byte under `Contents/Resources/Legal/`. Those source files and app
outputs are part of the native pre-sign manifest, and dependency verification
compares the embedded files with the reviewed repository sources.

## Runtime-emitted dependencies

### three@0.180.0

- Source: `https://github.com/mrdoob/three.js`, immutable tag `r180`.
- npm artifact and integrity: recorded under `node_modules/three` in
  `Web/package-lock.json`.
- License and copyright: MIT; Copyright © 2010-2025 three.js authors.
- Inclusion: WebGL scene/runtime code, `GLTFLoader`, and
  `BufferGeometryUtils`. The exact emitted files and byte contributions are in
  `Resources/Web/bundle-metafile.json`.
- Embedded code: `three.core.js` contains Mapbox Earcut 3.0.1, Copyright © 2016
  Mapbox, under the ISC License. Its notice is retained in
  `THIRD_PARTY_NOTICES.md`.

### @pixiv/three-vrm@3.5.5 family

- Source: `https://github.com/pixiv/three-vrm`, immutable commit
  `ff42fae4fcee1fcbca2cd262c7f5f8cbddeaf5ab`.
- npm artifacts and integrity: recorded individually in
  `Web/package-lock.json`.
- License and copyright: MIT; Copyright © 2019-2026 pixiv Inc.
- Inclusion: VRM 1.0 loading, MToon, expressions, look-at, spring bones, and
  node constraints. The emitted prebuilt module contains this family:
  `@pixiv/three-vrm`, `@pixiv/three-vrm-core`,
  `@pixiv/three-vrm-materials-hdr-emissive-multiplier`,
  `@pixiv/three-vrm-materials-mtoon`,
  `@pixiv/three-vrm-materials-v0compat`,
  `@pixiv/three-vrm-node-constraint`, `@pixiv/three-vrm-springbone`,
  `@pixiv/types-vrm-0.0`,
  `@pixiv/types-vrmc-materials-hdr-emissive-multiplier-1.0`,
  `@pixiv/types-vrmc-materials-mtoon-1.0`,
  `@pixiv/types-vrmc-node-constraint-1.0`,
  `@pixiv/types-vrmc-springbone-1.0`,
  `@pixiv/types-vrmc-springbone-extended-collider-1.0`, and
  `@pixiv/types-vrmc-vrm-1.0`.

### Platform dependency

Apple WebKit is supplied by macOS and is not vendored. The application links
the platform framework through Swift Package Manager. Its licensing and update
channel are those of the installed macOS release.

## Build-only dependencies

- `typescript@7.0.2` and its 20 `@typescript/typescript-<platform>@7.0.2`
  optional binaries come from `https://github.com/microsoft/TypeScript`, commit
  `2bd066d87f5bafd315be9f40889d0a60b9e58e0b`. They are Apache-2.0, Copyright
  Microsoft Corporation. Their supplied `NOTICE.txt` applies to the build tool
  and is not emitted into the app.
- `esbuild@0.28.1` and its 26 `@esbuild/<platform>@0.28.1` optional binaries
  come from immutable release tag `v0.28.1` at
  `https://github.com/evanw/esbuild`. They are MIT, Copyright © 2020 Evan
  Wallace. The qualification host uses only `@esbuild/darwin-arm64@0.28.1`;
  no esbuild code or binary is emitted.

All package-family members, registry URLs, integrities, licenses, and platform
names are enumerated individually in the lockfile and checked by the verifier.
The only allowed npm lifecycle script is esbuild's known install script, and
all restoration uses `npm ci --ignore-scripts`; the pinned native binary is
invoked directly.

## Contribution rule

Before any new third-party source or asset enters the repository, record its
canonical source, immutable revision, license, copyright, notice obligations,
included files, modifications, distribution role, and cryptographic hashes.
Do not add copyleft, noncommercial, source-available, field-of-use-restricted,
or unknown-license material. A permissive renderer license does not clear
sample avatars, textures, fonts, motions, or other upstream assets.
