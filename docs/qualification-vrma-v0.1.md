# VRMA v0.1 qualification record

Status: `HISTORICAL_V5.1_RECORD_WITH_ALPHA3_CHECKPOINT_UPDATE`

The first part of this record preserves the public source, dependency, legal,
and offline Web-bundle evidence captured at V5.1. At that historical stage,
the native `Resources/build-manifest.json` was intentionally unchanged and
V5.2 still had to regenerate it. Those statements and the original test counts
below describe that earlier checkpoint. They are not the current alpha.3
release state. **Alpha.3 checkpoint update** describes the current checkpoint.

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

Fresh alpha.3-candidate headless evidence passed:

- Dependency verification: PASS, with 65 locked packages and 19 emitted inputs.
- Web tests: PASS, with 74 tests and 0 failures.
- Web TypeScript check: PASS.
- Swift package tests: PASS, with 310 tests and 0 failures.
- release-discipline, deterministic-build, rollback, cleanup, and prohibited-
  asset contracts: PASS.
- `git diff --check`: PASS.

No model, VRMA clip, animation pack, motion cache, or user-file copy is bundled.
The immutable `v0.1.0-alpha.3` tag is the intended package checkpoint for
Miller C7 integration. Owner-visible private-model and compatible-motion
qualification remains a separate integrated-candidate gate.

## Later integration evidence

Miller's initial C7 integration source resolved `v0.1.0-alpha.2` at
`6b34f9ff35a94cdde9c7826bc67f2cfff02abd82`. Its remediated nonlaunching
source matrix passed model and motion failure isolation, replacement and
stale-callback fencing, Reduced Motion, Avatar-off fallback, typed and Live
semantic routing, played-output mouth cues, and source-test cleanup. The exact
alpha.3 package candidate now contains the renderer-persistence repair. The
Miller-side alpha.3 repin and integrated artifact remain pending; alpha.2 does
not contain that repair.
The owner-visible private-model, compatible-motion, physical focus, VoiceOver,
and real Live protocol remains `HUMAN_NOT_RUN`; it is not backfilled by this
earlier V5.1 record.
