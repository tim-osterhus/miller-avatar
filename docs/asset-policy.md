# Asset admission policy

No avatar or private fixture is a repository resource. The public tree rejects
`.vrm`, `.glb`, `.vrma`, `.png`, `.jpeg`, `.jpg`, `.heic`, and `.webp` files;
the generated tree is scanned separately with the same extension policy.
Private fixture roots or hashes are also rejected. Tests use synthetic JSON and
programmatically constructed GLB bytes only. Private visual qualification is a
separate manual activity and is not claimed by the public CI gate.

Miller Avatar admits immutable in-memory bytes. The admission API does not
accept or return a filesystem path. File selection and security-scoped access
belong to the native host.

The standalone alpha accepts one GLB 2.0 container with one JSON chunk and
zero or one BIN chunk. The JSON chunk must describe VRM 1.0 through
`VRMC_vrm.specVersion`. The parser rejects malformed framing, duplicate JSON
keys, nonfinite numbers, external resources, animation arrays, malformed or
over-budget sparse accessors, and unknown extensions.

Sparse accessors may omit their dense base, in which case unspecified values
are zero. Sparse indices must be unsigned, strictly increasing, unique, and in
range. Their index and value buffer views must be non-strided, aligned, and
fully bounded. Logical accessor bytes plus sparse index and override storage
all count against the accessor aggregate ceiling.

The extension allowlist is:

- `VRMC_vrm`
- `VRMC_materials_mtoon`
- `VRMC_springBone`
- `VRMC_node_constraint`
- `KHR_materials_unlit`
- `KHR_texture_transform`
- `KHR_materials_emissive_strength`

Images must use a BIN-backed buffer view and declare `image/png` or
`image/jpeg`. The declared MIME type, byte signature, ImageIO type, and parsed
dimensions must agree.

Every texture-info index resolves to an admitted texture. Each admitted texture
has an in-range image source and sampler. Joint accessor values are checked
against the skin paired with the mesh on each node, not against an unrelated
skin. An allowlisted extension is accepted only when its declared value is a
JSON object at its supported location.

## Inclusive Lightweight resource ceilings

The table below is the default Lightweight policy. It is intentionally finite
and remains the compatibility baseline for existing profiles.

| Resource | Ceiling |
| --- | ---: |
| Captured GLB | 128 MiB |
| JSON chunk | 8 MiB |
| JSON values | 262,144 |
| JSON nesting | 64 levels |
| Nodes | 4,096 |
| Meshes | 1,024 |
| Mesh primitives | 2,048 |
| Materials | 512 |
| Images | 64 |
| Textures | 64 |
| Samplers | 64 |
| One image dimension | 8,192 pixels |
| Decoded base-image pixels | 28,311,552 |
| Estimated RGBA8 base-image bytes | 108 MiB |
| Estimated RGBA8 bytes with full mip chains | 144 MiB |
| Buffer bytes | 64 MiB |
| Accessor-referenced bytes | 64 MiB |
| Vertices | 1,000,000 |
| Indices | 3,000,000 |
| Triangles | 1,000,000 |
| Morph targets on one primitive | 64 |
| Morph-target scalar values | 16,000,000 |
| Skins | 64 |
| Joints in one skin | 256 |
| Vertex joint influences | 8 |
| VRM humanoid bone entries | 128 |
| VRM expressions | 128 |
| Spring-bone joints | 512 |
| Spring-bone colliders | 512 |
| Spring-bone collider groups | 512 |
| Node constraints | 512 |
| Native preflight wall time | 5 seconds |

Decoded image estimates use four bytes per pixel. Full mip estimates multiply
that value by `4/3` and round upward. All aggregate arithmetic uses checked
64-bit operations.

## Opt-in High Quality model mode

The combined `v0.1.1` package adds High Quality for VRM model imports. It is
selected explicitly for an import and recorded on that profile; it does not
change the Lightweight default or silently reclassify an existing profile.
The profile's recorded mode is used again for capture, admission, reload,
materialization, retry, and content-change validation.

High Quality raises the policy envelope while keeping it finite:

| Resource posture | Lightweight | High Quality |
| --- | ---: | ---: |
| Captured GLB bytes | 128 MiB | **2.5 GiB (2,684,354,560 bytes)** |
| Buffer bytes | 64 MiB | **2.5 GiB (2,684,354,560 bytes)** |
| Accessor-referenced bytes | 64 MiB | **2.5 GiB (2,684,354,560 bytes)** |
| Aggregate byte, count, and geometry ceilings | baseline | 20x posture |
| One image dimension | 8,192 pixels | 4x, or 32,768 pixels |
| JSON nesting | 64 levels | unchanged |
| Renderer-supported skin layout | current supported layout | unchanged |
| Native preflight deadline | 5 seconds | no fixed deadline |

The 2.5 GiB values are explicit finite ceilings, not sentinel maxima. The
larger envelope does not weaken validation. High Quality still rejects
non-GLB or non-VRM-1 input, malformed JSON or GLB structure, external resource
references, invalid indices/offsets/ranges/cross-references, non-finite values,
checked integer or size overflow, unsupported renderer semantic shapes,
security-scope failure, changed file identity or digest, and explicit
cancellation. JSON nesting remains bounded for parser integrity, and the
renderer-compatible skin layout remains a format constraint.

High Quality also does not promise that a machine can load every model below
the policy ceiling. Platform address-space pressure, native allocation failure,
GPU exhaustion, and renderer failure remain real load/resource failures and use
the existing retry and quarantine behavior. They are not hidden by silently
falling back to Lightweight. Lightweight retains its five-second deadline;
High Quality has no fixed deadline but still responds to explicit cancellation.

Version 0.1.2 corrects one format-validation mismatch without changing either
resource budget. Base vertex normals and tangents retain the unit-vector
component envelope below. Morph-target `NORMAL` and `TANGENT` accessors are
finite FLOAT/VEC3 displacement deltas and are not unit vectors; morph-target
`POSITION` remains subject to the existing position envelope.

## Mouth cues and privacy boundary

Miller Avatar accepts scalar-only mouth cues for compatibility and optionally a
complete five-vowel value in the closed order `aa`, `ih`, `ou`, `ee`, `oh`.
Partial, unknown, non-finite, or out-of-range vowel objects fail closed. Model
capabilities report one Boolean per supported expression; unsupported weights
use the renderer's documented `aa` fallback. The package receives no raw audio,
PCM, spectrum, transcript, provider value, or microphone-derived signal and
requests no audio permission.

Mouth cues are presentation-only. Policy Off clears and suppresses current and
future mouth values while preserving playback and speaking lifecycle state.
Reduced Motion has precedence and clears mouth values even when policy is On.
Policy re-enable does not replay a prior cue; stale ordering and lifecycle
fences remain active. Interruption, replacement, hide/revoke, failure, retry,
reset, suspension, and disposal clear scalar and vowel state together.

## Numeric envelopes

| Value | Allowed envelope |
| --- | --- |
| Translation, collider offset, collider tail | absolute component at most 10,000 |
| Scale | absolute component from 0.000001 through 1,000 |
| Quaternion | absolute component at most 1.0001 and length from 0.99 through 1.01 |
| Matrix and inverse-bind component | absolute value at most 1,000,000 |
| Position and morph position | absolute component at most 10,000 |
| Base normal and tangent | absolute component at most 1.1 |
| Morph normal and tangent delta | finite FLOAT/VEC3 |
| Texture coordinate | absolute component at most 1,000 |
| Color and skin weight | 0 through 1 |
| Nonzero skin-weight sum | 0.99 through 1.01 |
| Material and texture-transform scalar | absolute value at most 1,000 |
| Spring scalar and collider radius | 0 through 1,000 |
| Spring gravity direction | absolute component at most 1.1 |
| Constraint weight | 0 through 1 |

Admission checks cancellation and, when the selected mode supplies one, its
monotonic deadline between parse stages. A cancellation, deadline, aggregate
overflow, or resource ceiling returns `resource_limit`. Invalid asset content
returns `asset_rejected`. Rejection does not create an asset token or retain
captured bytes in background work.

Admission runs its bounded parser and semantic validation away from the caller's
UI executor. It checks cancellation and, for Lightweight, deadline checkpoints
within long JSON, accessor, and floating-point scans as well as between stages.

Each admitted asset includes a capability summary derived only from the
validated envelope: whether the asset declares VRM look-at or spring-bone
support and how many materials declare MToon. This summary contains no path,
URL, renderer, or GPU information.

## VRMA motion policy

VRMA admission is separate from model admission and remains under its existing
Lightweight budget in both model quality modes. A model GLB remains invalid
when its root JSON contains an `animations` member. A motion enters only through
the bounded VRMA admission path.

Each profile stores at most 32 admitted local motions. The motion budget caps
captured bytes at 8 MiB and limits JSON, scene, accessor, channel, keyframe, and
duration complexity. The host stores a security-scoped bookmark and digest for
each motion. It does not store a source path or copy the source file.

Only six built-in role bindings cross the bridge: `idle`, `listening`,
`thinking`, `speaking`, `success`, and `failure`. One motion can serve multiple
roles. The web loader accepts only the session-bound local `.vrma` URL, requires
VRMA 1.0, rejects external URI members, and converts only humanoid skeletal
tracks for the active VRM. Expressions, look-at tracks, and other non-skeletal
tracks do not gain authority from VRMA.

Motion load and runtime failures are motion-local. Three consecutive failures
quarantine the motion. The model remains available, and the affected roles use
their defined fallback. A retry or a new successful load clears that motion's
failure count. Reduced Motion stops mixer advancement and restores the
normalized rest pose.

The user is responsible for the rights to every model and motion supplied to
the package. Miller Avatar distributes no model, VRMA, animation pack, motion
cache, or user-file copy. Custom triggers and user-authored motion graphs are
deferred from v0.1.

Miller integration does not widen this boundary. Miller stores the package's
owner-only bookmark and profile metadata under its Avatar application-support
root, passes only admitted capabilities to the host surface, and packages no
user-selected asset. A Miller typed, Live, history, capability, or tool payload
never becomes model or motion input.
