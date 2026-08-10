# VRMA v0.1 qualification record

Status: `V5.1_SOURCE_BUNDLE_CLOSED_HEADLESS_READY_FOR_INDEPENDENT_QA`

This record closes the public source, dependency, legal, and offline Web
bundle work for V5.1. It does not claim private-model visual qualification,
Miller integration, signing qualification, or an owner-visible GUI gate. The
native `Resources/build-manifest.json` is intentionally unchanged. V5.2 must
regenerate it from the parent’s committed V5.1 source head.

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

The full pinned headless evidence is:

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

The release-discipline contract now asserts the exact animation dependency and
provenance entry. It rebuilds the Web outputs twice in skip-install mode and
compares all output hashes. It also preserves the prior committed bundle after
a simulated bundle failure. Its full release run remains a V5.2 check because
the current build manifest is intentionally stale until the parent commits this
source closure. The current contract stop is the expected source revision
assertion: the manifest records `a7b4749c78fad6b756afac55e9a481d38d8d784f`,
while the current source set resolves to `ca340c21ad0a15293b893b77992565eb707ebb52`.

## Residual gates

After the parent commits the V5.1 source/bundle closure, V5.2 must use external
Swift scratch and cache roots. It must regenerate
`Resources/build-manifest.json` with the committed source revision. It must
then run the full `scripts/test.sh`, dependency, release-discipline, build,
cleanup, prohibited-asset, and `git diff --check` matrix. V5.3 private
visual/GUI qualification remains separate and was not run.

Subject to those explicit V5.2 and owner-visible gates, the source and offline
Web bundle closure is ready for independent QA.
