# Architecture

The standalone alpha is a Swift 6.1 package targeting macOS 15.
`MillerAvatarCore` owns shared contracts, `MillerAvatarHost` is the native-host
boundary, and `MillerAvatarApp` is the executable assembly target.

The core defines the closed v1 Swift/TypeScript bridge contract and shared
fixture corpus. It also implements pure, renderer-neutral reducers for the
native lifecycle, semantic presentation projection, mouth-cue revocation and
Reduced Motion, suspension/resume reconciliation, and serialized visibility
commands. It also owns bounded native admission of immutable in-memory bytes
for the closed GLB-form VRM 1.0 envelope; the full policy is in
`asset-policy.md`. The native host provides bounded selected-file capture,
ordered bridge transport, a reducer-backed orchestrator, and a contained WebKit
surface with a closed local scheme, fail-closed navigation, nonpersistent data
storage, session leases that fence stale callbacks, and idempotent unified
teardown. The AppKit assembly exposes native diagnostics and fallback controls;
the fallback remains visible until a valid first frame, and startup/load failure
retains usable native controls with one explicit retry.

`Web/` contains the pinned TypeScript local-web renderer core and production
bootstrap. It rejects
duplicate JSON keys before bridge decoding, requires an abort-aware
`RendererBackend` loading seam, fences timeout/context-loss terminal paths,
and releases the backend exactly once. It also bounds camera viewports and
runtime counters. Its current bundle is an atomically published deterministic
five-file, closed-CSP resource set with a complete v2 MIME/hash input and
payload manifest. Its native-host bootstrap installs the closed bridge and
observation transport before renderer readiness is reported. The assembled app
ships no private model fixtures or test-only fault hooks.

Clean Swift and app workflows treat `Resources/Web/` as a committed offline
artifact. They do not run npm or regenerate the bundle. Maintainer regeneration
requires the exact pinned Node/npm toolchain and an audited pre-populated npm
cache that satisfies `Web/package-lock.json` without registry access.

The build harness assembles an ad-hoc-signed local app from reviewed source
inputs. It uses repository-owned or explicitly supplied private SwiftPM and
module-cache roots, stages a complete bundle before publication, and preserves
the prior valid bundle if a new build fails. The signed boundary uses exactly
App Sandbox, read-only user-selected file access, and network client access so
WebKit child processes can start; `scripts/test-signed-boundary.sh` verifies
that the published bundle reaches wrapper and renderer readiness.
