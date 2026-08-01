# Miller Avatar

Miller Avatar is the optional avatar-presentation package for Miller. It is
kept separate so Miller remains usable when avatar presentation is absent,
disabled, loading, or unavailable.

## Standalone alpha foundation

The current repository milestone establishes a Swift 6.1 package targeting
macOS 15, an isolated Command Line Tools build harness, sandbox configuration,
and boundaries for the standalone alpha's core, native host, and app. It also
defines the closed v1 Swift/TypeScript bridge contract with shared fixtures and
implements renderer-neutral Swift reducers for lifecycle, semantic projection,
mouth cues, Reduced Motion, and visibility coordination. It does not yet
implement native-host bridge transport or the application UI. It includes a
pinned, testable TypeScript local-web renderer core with closed bridge
validation, lifecycle and presentation reducers, fake-backend coverage,
finite camera fitting, and a deterministic closed-CSP bundle. The core keeps
live Three.js/VRM loading behind an abort-aware backend seam; its generated
five-file bundle has an atomic v2 MIME/hash manifest. It does implement bounded
native preflight for the closed GLB-form VRM 1.0 envelope; see
`docs/asset-policy.md`. The native host also provides a contained WebKit
surface with a closed custom scheme, fail-closed navigation, nonpersistent
data storage, session leases, and idempotent renderer teardown.

Clean Swift tests and app builds use repository resources as committed. They
do not run npm or regenerate `Resources/Web/`. Maintainer-only bundle
regeneration requires the pinned Node/npm toolchain and an audited
pre-populated offline cache; a clean checkout alone is insufficient.

The first planned live compatibility target is VRM 1.0 with user-supplied
models and animations. Legacy VRM 0.x compatibility is deferred until that
path is proven.

See `docs/architecture.md` and `docs/development.md` for the implemented
foundation.

## Asset posture

Miller Avatar will not assume that a permissive renderer license clears
models, textures, animations, fonts, sounds, or other distributed assets.
Every bundled example asset must have independently verified commercial-use
and redistribution rights, provenance, attribution requirements, and hashes.

User-supplied assets remain separate from Miller Avatar's own license.

See `PROVENANCE.md` and `THIRD_PARTY_NOTICES.md`.

## License

Miller Avatar is licensed under the Apache License 2.0. See `LICENSE` and
`NOTICE`.
