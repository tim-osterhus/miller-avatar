# VRMA v0.1 qualification record

Status: `CURRENT_V0_1_1_PACKAGE_CHECKPOINT_WITH_HISTORICAL_ALPHA8_EVIDENCE`

The first part of this record preserves the public source, dependency, legal,
and offline Web-bundle evidence captured at V5.1. At that historical stage,
the native `Resources/build-manifest.json` was intentionally unchanged and
V5.2 still had to regenerate it. Those statements and the original test counts
below describe that earlier checkpoint, not the current release state. The
later checkpoint sections preserve each correction in order; **Alpha.8
repeating-motion stabilization** describes the final v0.1.0 package
checkpoint, while the final section records v0.1.1.

The Alpha.8 sections remain historical evidence for the published v0.1.0
source checkpoint. The final section records the current combined v0.1.1
release checkpoint and its package-level evidence; it does not replace the
separate owner-visible qualification required by consuming applications.

## Closed scope

- Runtime dependency: exact `@pixiv/three-vrm-animation@3.5.5`, alongside the
  reviewed `@pixiv/three-vrm@3.5.5` and `three@0.180.0` graph.
- Motion library: at most 32 admitted local motions per profile, with six
  built-in bindings: `idle`, `listening`, `thinking`, `speaking`, `success`,
  and `failure`. One motion may serve multiple roles. Custom triggers and
  user-authored motion graphs are deferred from v0.1.
- Admission and rights: native code owns bounded bytes, bookmarks, digests,
  bindings, and motion-local failure state. The user remains responsible for
  the rights to each supplied model and motion. No user asset is copied into
  the repository or redistributed.
- Runtime authority: VRMA supplies humanoid skeletal tracks only. Miller keeps
  semantic phase, expression, mouth, and gaze authority. Missing, rejected,
  quarantined, timed-out, and runtime-failed motions use the defined role or
  normalized-rest fallback without quarantining a valid model.
- Lifecycle: three consecutive motion load/runtime failures quarantine only
  that motion. Explicit retry or successful load clears its motion state.
  Profile replacement, removal, hide/resume, Reduced Motion, context loss,
  disable/revoke, and repeated disposal remain bounded and idempotent.
- Distribution: the package contains no model, VRMA, animation pack, motion
  cache, or user-file copy. Reduced Motion stops mixer advancement and restores
  the normalized rest pose. The Web CSP remains network-closed.

## TDD and automated evidence

The focused bundle-manifest test was run RED before regenerating the committed
bundle. It reported both the stale pre-VRMA package-lock hash and the missing
`@pixiv/three-vrm-animation`/motion source inputs. After the verifier and
bundle closure changes, the focused suite ran GREEN with 3 tests passing.

The historical V5.1 pinned headless evidence was:

- `npm run dependencies:check -- --skip-bundle`: PASS. It verified 65 locked
  package records.
- Web build and tests: PASS. 72 tests passed with 0 failures.
- Web TypeScript check: PASS.
- Swift package tests with external scratch and module-cache roots: PASS. 296
  tests passed with 0 failures.
- Two offline bundle rebuilds with
  `MILLER_AVATAR_WEB_SKIP_INSTALL=1`: PASS. Every output hash matched.

Existing V0–V4 tests provide the behavior matrix without duplicating it in this
closure. The evidence is distributed across these focused suites:

- `Tests/MillerAvatarHostTests/AvatarProfileStoreTests.swift` covers empty
  model/library state, profile replacement and revisions, motion-local
  quarantine/retry, removal, the 32-entry boundary with rejected entry 33,
  invalid/missing bindings, and persistence cleanup.
- `Tests/MillerAvatarHostTests/V2ContractRedTests.swift` and
  `Tests/MillerAvatarHostTests/LocalSchemeHandlerTests.swift` cover the closed
  six-role envelope, model-only resources, all six bindings, multiply-bound
  motion deduplication, replacement, revoke/disable, and idempotent release.
- `Tests/MillerAvatarHostTests/AvatarSurfaceControllerTests.swift`,
  `HostOrchestratorTests.swift`, and
  `WebKitAvatarRendererDriverTests.swift` cover profile replacement, hide and
  resume, Reduced Motion propagation, context/lifecycle fencing, repeated
  disposal, stale callbacks, and cleanup.
- `Web/tests/motion-controller.test.ts`, `motion-loader.test.ts`,
  `bridge.test.ts`, `contract.test.ts`, `renderer.test.ts`, and
  `disposal.test.ts` cover all six semantic roles, missing/unbound fallback,
  skeletal-only VRMA filtering, quarantine/retry signals, replacement,
  suspension/resume, Reduced Motion, context loss, disable/disposal, and
  resource cleanup.

## Deterministic committed Web outputs

The two pinned rebuilds produced identical SHA-256 records for all five
committed resources:

| Resource | SHA-256 |
| --- | --- |
| `app.js` | `2efb0201ab0877fdf4d9a7414b937de601d76f19409957c582b0e0839f6891a0` |
| `bundle-manifest.json` | `99d30351f5616d95f49794ff07190354fe85608da3a7a801ef688ab36e84c0c7` |
| `bundle-metafile.json` | `2f2f955c5e611edd9f52e8178519150768304396cca65fc1777fa46e646b6db6` |
| `index.html` | `5f7aced6cebbfe95873ea2c6ad40634d5994c9d18a1e6a247a3e609ec0736478` |
| `styles.css` | `3164ff84bd29e3dd67896b21094049596ecf02c9ea76a3546cab3fd51304a4ff` |

The bundle manifest records Node `22.22.0`, npm `10.9.4`, esbuild `0.28.1`,
the reviewed package-lock SHA-256
`38b7964641d9c5f7a28a7e22e6d84101c703fd084a058157025c70ace9d85fd4`, and the
reviewed esbuild binary digest. Its normalized inputs include the pinned Pixiv
animation module plus `src/motion-loader.ts` and `src/motion-controller.ts`.

## Release-discipline and prohibited-content checks

The dependency verifier and bundle script reject source maps and AIRI
references. They also reject private paths or metadata, author metadata in
normalized manifests, model or motion assets, and unapproved runtime URLs. The
HTML keeps the existing network-closed CSP. `NOTICE`,
`THIRD_PARTY_NOTICES.md`, and `PROVENANCE.md` identify the exact animation
package, license family, source commit, lockfile record, and inclusion boundary.

At V5.1, the release-discipline contract asserted the exact animation
dependency and provenance entry. It rebuilds the Web outputs twice in skip-install mode and
compares all output hashes. It also preserves the prior committed bundle after
a simulated bundle failure. The remaining V5.2 check at that time was the
expected source-revision assertion: the manifest recorded
`a7b4749c78fad6b756afac55e9a481d38d8d784f`, while that historical source set
resolved to `ca340c21ad0a15293b893b77992565eb707ebb52`. That stale-manifest condition
was subsequently closed and is no longer a current release gate.

## Residual gates

The historical V5.1 residual gates required external Swift scratch and cache
roots plus a regenerated `Resources/build-manifest.json`. V5.2 also had to run
the full test, dependency, release-discipline, build, cleanup,
prohibited-asset, and diff-check matrix. Those source/headless gates are now closed. Private
visual/GUI qualification remains separate and is not claimed by this record.

## Alpha.3 checkpoint update

The C7 renderer-persistence repair was committed as
`c411e0d73850b47debca80f71f2353b0c84c21cd`. The native package manifest was
then regenerated and committed in `930f4fbf176960ee6752f5cbcf45cd376578da36`.
Because release-document clarification is not a manifest input, the manifest
correctly records the committed source revision `c411e0d73850b47debca80f71f2353b0c84c21cd`.

Fresh alpha.3 checkpoint headless evidence passed:

- Dependency verification: PASS, with 65 locked packages and 19 emitted inputs.
- Web tests: PASS, with 74 tests and 0 failures.
- Web TypeScript check: PASS.
- Swift package tests: PASS, with 310 tests and 0 failures.
- release-discipline, deterministic-build, rollback, cleanup, and prohibited-
  asset contracts: PASS.
- `git diff --check`: PASS.

No model, VRMA clip, animation pack, motion cache, or user-file copy is bundled.
The immutable `v0.1.0-alpha.3` tag is published at
`dac4d0ab432a9c158dca40985b28335bdfc70e2b` as the package checkpoint for Miller
C7 integration. Owner-visible private-model and compatible-motion
qualification remains a separate integrated-candidate gate.

## Alpha.4 auxiliary-track compatibility update

Real-world VRMA qualification found otherwise-valid clips containing reachable
auxiliary rotation tracks outside the declared humanoid map. Pixiv conversion
does not retarget those tracks, and Miller Avatar's renderer already filters the
converted clip to the target avatar's normalized humanoid bones. Native
preflight nevertheless rejected the source document before conversion.

The compatibility repair was committed as
`51ae066a25e5f1781c0a12e5adb043f0cd9110d1`; its regenerated native package
manifest was committed as `adbf41f5cad871292704d910c7cf7e1e7fc6b585`.
The repair admits only bounded rotation tracks whose targets are reachable from
the default scene. Their accessors, interpolation, finite values, duration,
cardinality, and aggregate resource use remain subject to the existing closed
budgets. Non-hips auxiliary translation and unsupported paths remain rejected.

Fresh repair evidence passed:

- all seven private qualification clips passed the exact production admission
  path without entering the repository or release artifacts;
- Swift verification covered all 311 tests: 310 passed together, and the one
  timing-sensitive invalidation race passed when rerun in isolation;
- Web tests and type checking: PASS, with 74 tests and 0 failures;
- release build, manifest regeneration, shell contracts, and release-discipline
  rollback/cleanup contracts: PASS;
- `git diff --check`: PASS.

No qualification clip, model, animation pack, motion cache, or user-file copy
is bundled. The immutable package checkpoint is `v0.1.0-alpha.4`. Visual motion
quality and Miller semantic routing remain integrated-candidate gates.

## Alpha.5 root-motion and framing correction

Private integrated qualification exposed two distinct behaviors. One test
motion deliberately rotates its hips approximately 180 degrees, and another
begins crouched before rising; those poses are authored content. Separately,
the renderer applied an extra first-frame hips reanchor after Pixiv conversion
and fitted the camera only to the model's rest bounds. That combination shifted
later motion upward and cropped the avatar.

The correction was committed as
`01e87b910338849eeb8e9a54cf6d6ee7bf90546a`; its regenerated native package
manifest was committed as
`ae0f3355847eaa1aec55ccea26a9476c1e5dd120`. The renderer now preserves
Pixiv's target-relative skeletal conversion, rejects non-finite samples, and
fits one stable camera envelope over the configured motions' hips translation.
The envelope includes interior extrema for cubic-spline tracks and does not
move per frame. Reduced Motion returns to rest-pose framing.

Fresh alpha.5 checkpoint evidence passed:

- Web tests and TypeScript checking: PASS, with 78 tests and 0 failures;
- Swift package tests: PASS, with 311 tests and 0 failures;
- deterministic dual-build, rollback, cache, cleanup, and prohibited-asset
  contracts: PASS;
- `git diff --check`: PASS.

No private model, motion, source path, animation pack, or generated motion
cache entered the repository or package. The immutable package checkpoint is
`v0.1.0-alpha.5`. Owner-visible exact-model framing and semantic-motion quality
remain integrated-candidate gates; the package does not relabel unsuitable
authored clips as renderer failures.

## Later integration evidence

Miller's initial C7 integration source resolved `v0.1.0-alpha.2` at
`6b34f9ff35a94cdde9c7826bc67f2cfff02abd82`. Its remediated nonlaunching
source matrix passed model and motion failure isolation, replacement and
stale-callback fencing, Reduced Motion, Avatar-off fallback, typed and Live
semantic routing, played-output mouth cues, and source-test cleanup. The
published alpha.4 checkpoint contains the renderer-persistence repair plus the
auxiliary-track compatibility repair. Miller's prior source checkpoint
`5a8f7e761304e2daeb7bed8ca71163ab1ff15787` pins alpha.3; alpha.4 consumer
qualification is recorded separately in Miller. Alpha.2 does not contain the
renderer-persistence repair.
The owner-visible private-model, compatible-motion, physical focus, VoiceOver,
and real Live protocol remains `HUMAN_NOT_RUN`; it is not backfilled by this
earlier V5.1 record.

## Alpha.6 active framing and static-pose correction

Owner-visible integrated qualification of alpha.5 found excess deadspace in
both animated and Reduced Motion presentation, plus malformed clothing and
secondary geometry after entering Reduced Motion. Alpha.5 framed every active
state against the union of all configured clips. It also admitted mesh bounds
before checking whether any bound material could render, and stopped frame
advancement without fully settling normalized bones, render bones, spring
state, and scene matrices.

The alpha.6 correction was committed as
`395105adf6dd9f4a1ab34e79b826194a309660a0`; its regenerated native package
manifest was committed as
`3f56a925f1e5119aec46941465249213362f9fa2`. The
renderer now precomputes a bounded envelope per unique motion and selects only
the active motion's envelope. Rest presentation uses model-only bounds, and
non-rendering material geometry cannot enlarge those bounds. Reduced Motion
performs an ordered zero-delta settle before the static frame.

Fresh headless evidence passed:

- Web tests and TypeScript checking: PASS, with 81 tests and 0 failures;
- Swift package tests: PASS, with 311 tests and 0 failures after two unrelated
  timing-sensitive race tests passed in isolation and the complete suite then
  passed together;
- dependency, deterministic bundle, native build, rollback, cache, cleanup,
  and prohibited-asset contracts: PASS;
- `git diff --check`: PASS.

No private model, motion, source path, animation pack, or generated motion
cache entered the repository or package. Owner-visible exact-model framing and
Reduced Motion presentation remain a replacement-candidate gate; this record
does not infer that visual result from headless tests.

## Alpha.7 camera-depth, placement, and resize correction

Owner-visible integrated qualification of alpha.6 found a plane-like clipping
boundary in front of animated and Reduced Motion avatars, excess deadspace
below the avatar, and no supported way for Miller to resize the avatar surface.
The package camera used a near plane derived tightly from the static rest-pose
depth. Animated skinning and spring geometry could therefore cross the plane
even though the admitted model remained valid.

The alpha.7 renderer correction was committed as
`5039dfd1a9b08f0061217588ea35ba16964befc8`; its regenerated native package
manifest was committed as
`77fc085dcfc01a6149411451325702acdc9d2b98`. The renderer now keeps a
0.01-meter near plane and a minimum 100-meter far plane, applies bottom-biased
framing only within measured padded surplus, and refits when the host surface
changes size. Reduced Motion resize events also render a fresh static frame.

Fresh headless evidence passed:

- Web tests and TypeScript checking: PASS, with 84 tests and 0 failures;
- Swift package tests: PASS, with 311 tests and 0 failures. One timing-sensitive
  navigation-policy race failed in the first complete run, passed immediately
  in isolation, and passed in the second complete run;
- dependency, deterministic bundle, native build, rollback, cache, cleanup,
  and prohibited-asset contracts: PASS;
- `git diff --check`: PASS.

No private model, motion, source path, animation pack, or generated motion
cache entered the repository or package. Exact-model clipping, placement, and
live resize remain owner-visible replacement-candidate gates; this record does
not infer their visual result from headless tests.

## Alpha.8 repeating-motion stabilization

Owner-visible integrated qualification of alpha.7 confirmed the camera-depth,
placement, and live-resize corrections, then found that the configured
Listening motion moved the avatar farther away on successive cycles. The
admitted clip was not loop-ready: its authored hips translation ended at a
different planar position from where it began. The mixer repeated the authored
track; the camera did not accumulate transforms or refit per cycle.

The alpha.8 renderer correction was committed as
`f35328094389c4a67f378c3ba7eb8a0527c6f185`; its regenerated native package
manifest was committed as
`5f01eacf105a8b64227afe58ede6c230d59d8025`. The loader now keeps each admitted
source clip unchanged and derives an in-place variant for `idle`, `listening`,
`thinking`, and `speaking`. The
derived clip anchors hips X/Z to finite normalized-rest values, preserves hips
Y and all other skeletal animation, and zeroes only planar cubic-spline
tangents. Missing normalized-rest X/Z uses the first authored planar sample as
a nonblocking compatibility fallback. `success` and `failure` retain the
original clip and authored root motion. Role-specific camera bounds follow the
actual derived or original clip even when one motion token is shared across
roles.

Fresh headless evidence passed:

- focused motion-loader, controller, and renderer tests: PASS, with 45 tests
  and 0 failures;
- complete Web tests and TypeScript checking: PASS, with 89 tests and 0
  failures;
- Swift package tests: PASS, with 311 tests and 0 failures;
- dependency, deterministic dual-bundle, native build, rollback, cache,
  cleanup, and prohibited-asset contracts: PASS;
- independent adversarial review: PASS, with no P0, P1, or P2 findings;
- `git diff --check`: PASS.

No private model, motion, source path, animation pack, or generated motion
cache entered the repository or package. The exact private Listening clip was
used only for local diagnosis. Owner-visible qualification subsequently
confirmed stable repeated Listening cycles, corrected camera depth and
placement, dynamic surface resizing, profile replacement, retry, Reduced
Motion, Basic Chat, and Live Voice behavior. Those observations complete the
source-package v0.1 gate; signing and notarization remain responsibilities of
consuming applications.

## v0.1.1 combined release qualification

Status: `CURRENT_V0_1_1_RELEASE`

This package release is one immutable `v0.1.1` containing both optional
played-output lip sync and High Quality VRM model admission. There is no
separate High Quality package tag. The release review and full package gate
cover the existing lip-sync tranche together with HQ1–HQ3.

### High Quality admission scope

Lightweight remains the default and the compatibility meaning of legacy
profiles. High Quality is selected per model import and recorded in the
existing `performanceProfile` field. The recorded mode remains authoritative
for capture, admission, persisted validation, materialization, reload, retry,
and content-change re-admission. Changing the next-import default does not
reclassify an existing profile.

The High Quality envelope keeps three explicit finite outer ceilings. Captured
GLB bytes, buffer bytes, and accessor-referenced bytes each allow exactly 2.5
GiB (2,684,354,560 bytes). Other aggregate byte/count/geometry ceilings use a
20x posture relative to Lightweight. One image dimension uses a 4x posture,
with a 32,768-pixel limit instead of 8,192. JSON nesting and the
renderer-supported skin layout remain integrity/compatibility constraints.
Lightweight keeps its five-second preflight deadline. High Quality has no fixed
preflight deadline. Both modes retain explicit cancellation.

The larger envelope does not bypass safety checks. Both modes still reject
malformed or non-VRM-1 GLB input, external resources, invalid offsets, ranges,
and cross-references. They also reject non-finite values, checked arithmetic
overflow, unsupported renderer shapes, security-scope or file-identity/digest
failures, and explicit cancellation.

A model can fit the policy and still fail on a real machine. Address-space,
native allocation, GPU, and renderer limits remain real runtime constraints.
Such a failure remains a load/resource failure. It may follow the existing
retry and quarantine path instead of silently falling back to Lightweight.

VRMA admission is unchanged and remains under its existing Lightweight budget
in either model mode. VRMA remains skeletal-only and cannot own or restore
expression or mouth presentation.

### Optional lip-sync scope

The package keeps scalar-only mouth cues compatible and accepts a complete
five-vowel value in the closed order `aa`, `ih`, `ou`, `ee`, `oh`. Miller's
private Live peer derives optional cues only from played remote output. Raw
audio, FFT/spectral data, transcript text, and provider values do not cross the
Avatar bridge, and Miller Avatar does not acquire microphone audio. Partial
expression models use the documented fallback. Qualification may report a
responsive five-vowel approximation. It must not claim phoneme accuracy.

### Evidence boundary

The combined release is published as one immutable `v0.1.1` checkpoint.
Private model and audio qualification remains
owner-visible evidence only. No private model, motion, audio, transcript,
source path, or identifying metadata may enter this repository, its bundle, or
this public record.

### Task 6 provenance and package boundary

The reviewed behavioral donor is the local MIT `vrm-studio-2` repository at
immutable commit
`dc077143a2bc279f384cc4e2acaa86c459efb489`. The reviewed files are
`src/js/lip_sync_analysis.js`, `tests/lip_sync_analysis.test.js`, and the
smoothing behavior in `src/js/vrm_audio.js`. Miller Avatar adapts only the
pure five-vowel ordering, bounded fallback, and `0.55` attack/`0.30` release
smoothing behavior in its independently implemented controller. The donor root
MIT notice, copyright `(c) 2026 ZaberKo`, is retained in
`THIRD_PARTY_NOTICES.md`.

At the same donor commit, `package.json` declares `"license": "ISC"` while the
root `LICENSE` is MIT. This metadata discrepancy is retained in the public
provenance record; no ISC license is claimed for the adaptation. No donor
source/test file, microphone acquisition, `AudioContext`/`AnalyserNode`
ownership, raw audio, model, motion, screen capture, private fixture, or
machine-specific generated metadata is copied into the package.

### Task 6 release identity and evidence boundary

The candidate build identity is `0.1.1` with build number `1`. Lightweight
remains the default; High Quality is per-import and per-profile, with exact
2.5 GiB captured-file, buffer, and accessor ceilings, a 20x aggregate posture,
and a 4x image-dimension posture. Integrity checks, explicit cancellation,
runtime allocation failures below the policy ceiling, stored-mode authority,
and the unchanged Lightweight VRMA budget remain in force. Optional lip sync
and High Quality are one combined release; no separate tag is created.

The generated Web and native manifests are regenerated from reviewed source
and package-lock inputs. The candidate package gate copies no private assets
into public artifacts. Its bounded signed-boundary probe launches only the
package's diagnostic app long enough to prove native-wrapper and Web-renderer
readiness; it does not launch or replace Miller and is not a visual-quality
claim.

### Task 6 headless execution record

The release-closure commands were run on the candidate. Only the final bounded
signed-boundary probe launched the diagnostic app:

- `scripts/bundle-web.sh`: PASS with Node `22.22.0`, npm `10.9.4`, and the
  locked dependency graph. The generated `app.js`, `bundle-manifest.json`, and
  `bundle-metafile.json` include the already-implemented mouth controller and
  its policy/renderer sources.
- `scripts/build.sh`: PASS. The ad-hoc-signed diagnostic app assembled with
  product short version `0.1.1`; the build script itself did not launch the
  app. The separate bounded signed-boundary probe below launched it.
- `scripts/test-release-discipline.sh`: PASS, including deterministic native
  builds, simulated toolchain/Swift/assembly/code-sign failures, publication
  rollback, interruption cleanup, declared-root cleanup, and shared-cache
  preservation.
- Web type checking: PASS. Web test compilation and execution: PASS, 116/116.
  The exact generated-module closure contains 20 emitted inputs, including the
  package-owned `src/mouth-controller.ts`.
- Swift package tests: PASS, 350/350.
- `scripts/verify-dependencies.sh`: PASS with 65 locked packages and 20 emitted
  inputs.
- `scripts/test.sh`: PASS, including all Web, Swift, shell-contract,
  deterministic-build, rollback, injected-failure, publication, interruption,
  and cleanup gates.
- `git diff --check`: PASS. Tracked/public asset-extension, generated Web
  resource, native manifest, and embedded legal-notice scans found no model,
  motion, audio, screen-capture, private fixture, or private path marker.
- `scripts/test-signed-boundary.sh`: PASS against the freshly built,
  ad-hoc-signed diagnostic app. The probe verified the exact expected
  entitlement keys and reached both wrapper and renderer readiness. This is a
  production-boundary check, not owner-visible visual qualification.

The generated native manifest records only reviewed source, legal, static, and
Web-resource hashes; the generated Web manifests record the locked graph and
relative input names. The annotated `v0.1.1` tag identifies the independently
reviewed commit containing this evidence and the complete release diff.
