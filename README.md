# Miller Avatar

Miller Avatar is the optional avatar-presentation package for Miller. It is
kept separate so Miller remains usable when avatar presentation is absent,
disabled, loading, or unavailable.

## Standalone alpha

The current repository milestone assembles a Swift 6.1 macOS 15 diagnostic
application with a native-first fallback UI and contained WebKit renderer. It
captures a selected VRM as bounded in-memory bytes, performs native admission,
and keeps file paths out of the bridge, diagnostics, and persistence. A strict
ordered Swift/TypeScript bridge drives the renderer; the host keeps the fallback
visible until a valid first frame, closes startup and load deadlines, and permits
only one explicit retry.

The app uses the existing pure reducers for lifecycle, semantic presentation,
mouth cues, Reduced Motion, and visibility. Its local web bundle has a closed
CSP and scheme boundary, fail-closed navigation, nonpersistent data storage,
session fencing, and idempotent renderer teardown. The release bundle is ad-hoc
signed with App Sandbox, read-only user-selected file access, and the network
client entitlement required for WebKit child processes. `scripts/test-signed-boundary.sh`
verifies that freshly signed bundles reach wrapper and renderer readiness without
shipping fault hooks or private model fixtures.

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
