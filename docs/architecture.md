# Architecture

Miller Avatar is a reusable offline Swift package plus a standalone diagnostic
app. It is a presentation boundary, not a bundled assistant or asset pack. The
package targets macOS 15 with Swift 6.1. `MillerAvatarCore` owns shared
contracts and renderer-neutral policy, `MillerAvatarHost` is the public native
host boundary, and `MillerAvatarApp` is a thin diagnostic consumer of that
public API. Miller consumes the same public host boundary as an optional,
in-process presentation feature; the diagnostic app remains a separate thin
consumer.

## Package boundary and identity ownership

The core defines the closed Swift/TypeScript bridge contract. Its pure,
renderer-neutral reducers cover native lifecycle, semantic presentation,
mouth-cue revocation, Reduced Motion, suspension/resume reconciliation, and
serialized visibility commands. It also admits immutable in-memory bytes for the
closed GLB-form VRM 1.0 envelope; the full policy is in `asset-policy.md`.

The caller owns semantic session, request, generation, playback, projection,
and cue identity values. `ProjectPhasePayload` carries the caller's projection
sequence, generation ID, phase, and playback ID. `SetMouthPayload` carries the
caller's generation/playback IDs, cue index, playback offset, and scalar. The
package validates ordering, lease matching, and safe bounds; it does not derive
these values from Miller assistant state. The standalone diagnostic app creates
synthetic values for its controls. The host also allocates an internal renderer
session UUID for callback fencing and exposes it in `HostSnapshot`; that value
is not Miller's request or session identity.

## Public host surface

`AvatarSurfaceController` is `@MainActor` and owns the renderer surface's
lifecycle. Its public contract is:

| Surface | Contract |
| --- | --- |
| `view` | A container for the renderer. The container and installed WebKit view are noninteractive: no focus, hit testing, accessibility children, or drag-and-drop input. |
| `start()` | Starts the package renderer and deadline timer once. Repeated calls do not create another renderer or timer. |
| `load(_:)` | Accepts only an `AdmittedAsset` and returns `AssetLoadDisposition`; raw bytes, URLs, and paths are not accepted by the renderer surface. |
| `onObservation` | Receives session-validated `HostObservation` values on the main actor. |
| `onSnapshot` / `snapshot` | Exposes lifecycle, fallback, admission, visibility, identity, counters, failure, and retry state. |
| `dispose(reason:)` | Stops the renderer, detaches its view, invalidates the deadline timer, and permanently closes the controller. It is idempotent. |

The owner should embed `view`, then call `start()` after its view hierarchy is
ready, and call `dispose(reason:)` from window or application teardown. A
disposed controller is not restarted. `retry()` is the explicit single retry
path after a renderer failure.

`WebKitAvatarRendererDriver` is the single package renderer driver. It owns the
contained WebKit bridge, local scheme, session lease, observation transport, and
unified teardown used by `AvatarSurfaceController`; the standalone app does not
provide a second renderer implementation.

## Offline renderer resources

The `MillerAvatarHost` SwiftPM target has exactly one package-owned renderer
resource bundle. Its source directory is
`Sources/MillerAvatarHost/Resources/Web/`, declared as the target's
`.copy("Resources/Web")` resource. SwiftPM produces
`MillerAvatar_MillerAvatarHost.bundle`; the assembled app places that fixed
bundle at `Contents/Resources/MillerAvatar_MillerAvatarHost.bundle`.

`WebKitAvatarRendererDriver` resolves that fixed embedded bundle when
`Bundle.main` is an `.app`. In ordinary SwiftPM contexts, including tests, it
falls back to `Bundle.module`. Both paths must expose exactly the reviewed five
resources under `Web/`: `index.html`, `app.js`, `styles.css`,
`bundle-manifest.json`, and `bundle-metafile.json`. There is no alternate
package-owned renderer bundle.

The local web renderer uses a closed CSP and local scheme, fail-closed
navigation, nonpersistent WebKit data storage, session fencing, and idempotent
teardown. It has no network runtime dependency. The signed app's network-client
entitlement exists for WebKit child-process startup, not for fetching avatar
content.

## Asset admission and profile persistence

Asset admission accepts bounded immutable in-memory bytes and returns an
`AdmittedAsset` capability. File selection and security-scoped access belong to
the host or caller. No default avatar, model, VRMA, animation pack, model
cache, or user-file copy is packaged. The native fallback is a static/no-avatar
state until an admitted user-supplied asset is loaded.

`AvatarProfileStore` is a public actor for optional local profile metadata. It
uses a caller-provided root and the owner-only `profiles-v2.json` file. It reads
the legacy `profiles-v1.json` file only for migration. The current envelope is
schema version 2 with a `profiles` array. Each `StoredAvatarProfile` record
contains exactly:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Profile schema version, currently `2`. |
| `id` / `displayName` | Stable profile identity and bounded display label. |
| `modelBookmark` | Security-scoped bookmark data; no source path is stored. |
| `modelSHA256` / `capturedByteCount` | Digest and captured-byte metadata for revalidation. |
| `rightsLabel` / `performanceProfile` | Fixed metadata: `local_user_supplied` and `lightweight`. |
| `consecutiveLoadFailures` | Persisted failure count from `0` through `3`; quarantine is derived at `3`. |
| `profileRevision` | Monotonic revision for profile replacement and stale-load fencing. |
| `motionLibrary` / `motionBindings` | Bounded motion references and the closed built-in role map. |

Import captures the selected source inside a balanced security scope, admits
the bytes, records the bookmark and digest, and persists metadata. Load resolves
the bookmark, refreshes stale bookmark data, captures and re-admits the current
source, and updates the digest and byte count when they changed. Bookmark,
capture, admission, and renderer failures increment the profile's failure
count. Three consecutive failures quarantine the profile; a quarantined profile
is not loaded automatically. Explicit success reset or explicit reselection is
required. Removing a profile removes only local metadata and leaves the
original user file untouched. The store creates its root with mode `0700` and
its profile file with mode `0600`; persistence is owner-only and path-free in
its error surface.

### Bounded VRMA motion library

Profile schema v2 stores up to 32 admitted local motions and a profile revision.
Each motion has its own bookmark, digest, byte count, display name, failure code,
and consecutive failure count. Three consecutive load or runtime failures
quarantine that motion. Motion quarantine does not increment the model's
failure count and does not make a valid model unavailable.

The binding map is closed to six built-in roles: `idle`, `listening`, `thinking`,
`speaking`, `success`, and `failure`. A motion may bind to multiple roles. The
host resolves only those bindings and sends only the resolved motion bytes to
the local WebKit session. Empty and unbound libraries remain valid model-only
profiles.

VRMA has skeletal-only authority. Miller owns semantic phase, expression,
mouth, and gaze state at the integration boundary. Missing, rejected,
quarantined, timed-out, or runtime-failed motions use role or normalized-rest
fallback. Removing a motion or profile removes local metadata and releases
prepared bytes. It leaves the original user file untouched.

Reduced Motion stops the mixer and restores the normalized rest pose. Custom
triggers and user-authored motion graphs are deferred from v0.1. The package
does not bundle a model, motion, animation pack, or motion cache.

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

The normalized web metafile is the emitted-input authority, and the web bundle
manifest hashes every declared source and payload. Native assembly creates a
pre-sign manifest from the executable inputs, Info.plist, legal notices, static
resources, and web resources. The app embeds the reviewed `LICENSE`, `NOTICE`,
and `THIRD_PARTY_NOTICES.md` under `Contents/Resources/Legal/`. Machine-specific
executable output and `_CodeSignature` bytes stay outside the committed
pre-sign manifest; an external post-sign receipt hashes the signed executable
and complete signed tree. Neither receipt includes itself.

Clean Swift and app workflows treat `Sources/MillerAvatarHost/Resources/Web/`
as a committed offline artifact. They do not run npm or regenerate the bundle.
Maintainer regeneration requires the exact pinned Node/npm toolchain and an
audited pre-populated npm cache that satisfies `Web/package-lock.json` without
registry access.

The build harness assembles an ad-hoc-signed local app from reviewed source
inputs. It uses repository-owned or explicitly supplied private SwiftPM and
module-cache roots, stages a complete bundle before publication, and preserves
the prior valid bundle if a new build fails. The signed boundary uses exactly
App Sandbox, read-only user-selected file access, and network client access so
WebKit child processes can start; `scripts/test-signed-boundary.sh` verifies
that the published bundle reaches wrapper and renderer readiness.

Release automation uses run-private SwiftPM and module-cache roots. Independent
builds must produce byte-identical pre-sign manifests and post-sign receipts.
Cleanup accepts only repository-declared roots or externally marked build roots,
and the release contract snapshots both Xcode's DerivedData module cache and
the Darwin per-user Clang module cache before and after the gate. CI runs the
same public checks with read-only repository permission and contains no upload,
package, tag, or release step.

The standalone app is a diagnostic consumer, not an alternate host or renderer
implementation. Its controls generate synthetic presentation payloads and use
the public surface to exercise lifecycle, visibility, admission, and teardown.
Miller owns enablement, profile selection, the 200-point noninteractive overlay
attachment, typed and Live semantic projection, and played-output mouth-cue
generation. It does not create a sidecar or second audio path. Package failures
remain Avatar-local and cannot gate Miller's typed, Live, history, settings,
approval, or tool authorities.

The repositories document automated checks and command paths. The remediated
C7 source/headless matrix passes. The alpha.7 package checkpoint keeps a
0.01-meter near plane and a minimum 100-meter far plane so skinning and spring
bones can move toward the camera without crossing a rest-pose-tight clipping
plane. When horizontal fit leaves spare vertical room, the target shifts within
the proven padded bounds so the avatar sits lower in the surface. A root
`ResizeObserver` refits the camera when its caller changes the surface size and
re-renders the static frame under Reduced Motion. Alpha.7 retains alpha.6's
active-motion envelope, renderable-material filtering, and settled rest pose,
plus the renderer-persistence and bounded reachable auxiliary-track repairs.
Alpha.2 does not contain the persistence repair, alpha.3 retains the
over-strict auxiliary-track rule, alpha.4 retains incorrect first-frame hips
reanchoring, alpha.5 uses the union of every configured motion envelope, and
alpha.6 uses a rest-pose-tight camera depth range. Private-asset visual,
physical focus, VoiceOver, real Live, signing, and final release qualification
remain separate gates.
