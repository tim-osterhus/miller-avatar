# Miller Avatar

Miller Avatar is a reusable offline Swift package plus a standalone diagnostic
app for noninteractive avatar presentation. It is not a bundled assistant or
asset pack.

The package targets macOS 15 with Swift 6.1 and exposes `MillerAvatarCore` and
`MillerAvatarHost`; `MillerAvatarApp` is a thin diagnostic consumer of those
public APIs. Miller now consumes those package products as an optional,
in-process presentation feature. The package remains independently usable and
does not depend on Miller assistant state.

The caller owns its session, request, generation, playback, projection, and cue
identity values. It supplies the semantic payloads used for projection and
mouth cues; the package validates ordering and fences stale renderer callbacks
but does not synthesize Miller assistant state. The standalone diagnostic app
creates synthetic values only for its controls. The renderer session UUID
exposed in `HostSnapshot` is an internal callback-fencing value, not Miller's
request or session state.

## Standalone alpha

The current repository milestone assembles a Swift 6.1 macOS 15 diagnostic
application with a native-first fallback UI and contained WebKit renderer. It
captures a selected VRM as bounded in-memory bytes, performs native admission,
and keeps source paths out of the bridge and profile metadata. A strict ordered
Swift/TypeScript bridge drives the renderer; the host keeps the fallback visible
until a valid first frame, closes startup and load deadlines, and permits only
one explicit retry.

The app uses the existing pure reducers for lifecycle, semantic presentation,
mouth cues, Reduced Motion, and visibility. Its local web bundle has a closed
CSP and scheme boundary, fail-closed navigation, nonpersistent data storage,
session fencing, and idempotent renderer teardown. The release bundle is ad-hoc
signed with App Sandbox, read-only user-selected file access, and the network
client entitlement required for WebKit child processes; it has no network
runtime dependency. `scripts/test-signed-boundary.sh` defines an automated
signed-boundary check for wrapper and renderer readiness without fault hooks or
private model fixtures.

The public automated gate verifies the complete npm lock graph and legal
ledger, regenerates deterministic web resources, compares two independent
native builds, checks pre-sign and post-sign hash boundaries, exercises failed
publication rollback, proves cleanup stays within declared roots, and confirms
the shared Clang module cache is unchanged. CI runs this gate but does not
publish, notarize, or claim private-fixture visual qualification.

Clean Swift tests and app builds use repository resources as committed. They
do not run npm or regenerate `Sources/MillerAvatarHost/Resources/Web/`.
Maintainer-only bundle
regeneration requires the pinned Node/npm toolchain and an audited
pre-populated offline cache; a clean checkout alone is insufficient.

The admitted model envelope is VRM 1.0 with user-supplied models. User-supplied
VRMA support is bounded to a local motion library in each profile.

## Bounded VRMA motion

The motion library stores at most 32 admitted local motions. Six built-in roles
can bind those motions: `idle`, `listening`, `thinking`, `speaking`, `success`,
and `failure`. One motion can serve multiple roles. Custom triggers and
user-authored motion graphs are deferred from v0.1.

Native admission owns motion bytes, bookmarks, rights metadata, bindings, and
the three-failure quarantine counter. The user must have the rights required
to use each model and motion. The package does not redistribute user assets or
copy them into the repository.

VRMA has skeletal-only authority. Miller owns semantic phase, expression,
mouth, and gaze state at the integration boundary. A missing, rejected,
quarantined, or runtime-failed motion falls back to the current steady role,
`idle`, or the normalized rest pose. Motion failure does not quarantine a valid
model. Removing a motion or profile removes local metadata and leaves the
original user file untouched.

Repeating `idle`, `listening`, `thinking`, and `speaking` roles retain authored
vertical movement and skeletal performance but run with planar hips travel
anchored to the avatar's normalized rest position. This prevents locomoting or
non-loop-ready clips from moving farther across or into the scene on every
cycle. One-shot `success` and `failure` roles retain their authored root motion.

Reduced Motion stops motion advancement and restores the normalized rest pose.
The package bundles no model, VRMA, animation pack, motion cache, or user-file
copy. Legacy VRM 0.x compatibility remains deferred.

The package launches into its native static/no-avatar presentation until the
caller supplies an admitted asset. Internal fixtures and asset-authoring
studies are qualification evidence only and are not release content.

## Public package boundary

`AvatarSurfaceController` is the main `@MainActor` surface. Embed its `view`,
call `start()` after the owner has installed the view, and observe
`onObservation` and `onSnapshot` for renderer events and lifecycle state. Its
renderer surface is deliberately noninteractive: it does not accept focus,
hit testing, accessibility children, or drag-and-drop input. `load(_:)` accepts
only an `AdmittedAsset`; raw bytes and file paths are not renderer inputs. Call
`dispose(reason:)` when the owner tears down the surface. Start and disposal are
idempotent; a disposed controller is not restarted.

`WebKitAvatarRendererDriver` is the package's single renderer driver. The
`MillerAvatarHost` SwiftPM target owns exactly one renderer resource bundle,
assembled from `Sources/MillerAvatarHost/Resources/Web/`. An assembled `.app`
resolves the fixed `MillerAvatar_MillerAvatarHost.bundle`; ordinary SwiftPM
contexts use `Bundle.module` as the fallback. No alternate renderer bundle or
asset pack is selected at runtime.

`AvatarProfileStore` is the optional owner-only local persistence boundary. It
stores `profiles-v2.json` metadata and a security-scoped bookmark, not a copied
model file or source path. It reads the legacy v1 file only for migration.
Import and load re-capture, re-admit, and SHA-256 check the source bytes. Three
consecutive load or renderer failures quarantine a profile; recovery requires
an explicit success reset or explicit reselection. The original user file
remains untouched. See `docs/architecture.md` for the schema and lifecycle
details.

See `docs/architecture.md` and `docs/development.md` for the implemented
foundation.

## Asset posture

Miller Avatar will not assume that a permissive renderer license clears
models, textures, animations, fonts, sounds, or other assets. This tranche
distributes no character model, VRMA, motion asset, model cache, or user-file
copy.

User-supplied assets remain separate from Miller Avatar's own license and are
admitted only from bounded in-memory bytes.

See `PROVENANCE.md` and `THIRD_PARTY_NOTICES.md`.

## Qualification status

The repository contains automated contract, build, cleanup, and signed-boundary
checks. The alpha.8 package checkpoint stabilizes repeating steady-role motion
at normalized rest X/Z while preserving authored Y movement and terminal
one-shot root motion. It retains alpha.7's safe camera depth, bottom-biased
placement, and caller-driven surface resizing; alpha.6's active-motion framing,
renderable-material filtering, and settled Reduced Motion rest frame; and
alpha.4's renderer-persistence and bounded auxiliary-track compatibility
repairs.
Alpha.2 does not contain the persistence repair, alpha.3 retains the
over-strict auxiliary-track admission rule, alpha.4 retains the incorrect
first-frame hips reanchoring, alpha.5 uses a profile-wide camera envelope, and
alpha.6 uses a rest-pose-tight camera depth range. Alpha.7 preserves arbitrary
planar travel in indefinitely repeating steady-role clips.
Owner-visible private-asset, focus, accessibility, and real Live checks remain
explicitly separate. This documentation does not claim signing, notarization,
or final v0.1 release qualification.
The V5.1 source and bundle record is in
[`docs/qualification-vrma-v0.1.md`](docs/qualification-vrma-v0.1.md).

## License

Miller Avatar is licensed under the Apache License 2.0. See `LICENSE` and
`NOTICE`.
