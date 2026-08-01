# Provenance policy

Miller Avatar starts as a clean repository. It does not inherit source code,
tests, assets, or Git history from Cortana Assistant, VoiceInk, the private
Cortana avatar, or any prospective donor project.

The standalone-alpha foundation contains no third-party Swift package
dependency and no bundled model, animation, or renderer asset.

`Resources/Static/MillerAvatarFallback.svg` is a minimal neutral fallback
placeholder authored for Miller Avatar. It contains no third-party artwork,
model, animation, texture, font, or renderer asset.

The web project locks three 0.180.0 and @pixiv/three-vrm 3.5.5 for the future
live-renderer seam. It also locks the build-only TypeScript 7.0.2, esbuild
0.28.1, and darwin-arm64 esbuild executable 0.28.1. Their source repositories
are [mrdoob/three.js](https://github.com/mrdoob/three.js),
[pixiv/three-vrm](https://github.com/pixiv/three-vrm),
[microsoft/TypeScript](https://github.com/microsoft/TypeScript), and
[evanw/esbuild](https://github.com/evanw/esbuild).

`Web/package-lock.json` is the dependency resolution authority for this
checkpoint. Its SHA-256 is
`666c5cf8e4319b680a5b9c6c3b08bae20c580888b214a8ff3df96938c243a3e8`.
The direct locked artifacts are:

- `three@0.180.0`: registry artifact
  `https://registry.npmjs.org/three/-/three-0.180.0.tgz`; integrity
  `sha512-o+qycAMZrh+TsE01GqWUxUIKR1AL0S8pq7zDkYOQw8GqfX8b8VoCKYUoHbhiX5j+7hr8XsuHDVU6+gkQJQKg9w==`.
- `@pixiv/three-vrm@3.5.5`: registry artifact
  `https://registry.npmjs.org/@pixiv/three-vrm/-/three-vrm-3.5.5.tgz`;
  integrity
  `sha512-RPXy7jYAXs704NIpZlosB0U2ENu21G9DrqGWdQgRe8dShaCo1ugpj+6BVPRCy91nt+MPMA96j5rbsSzEl0HlQA==`.
- `typescript@7.0.2`: registry artifact
  `https://registry.npmjs.org/typescript/-/typescript-7.0.2.tgz`; integrity
  `sha512-8FYau96o3NKOhbjKi/qNvG/W5jhzxkbdm5sj9AbZ/5T5sWqn3hJgLfGx27sRKZWTvyzCP8dLRBTf5tBTSRVUNA==`.
- `esbuild@0.28.1`: registry artifact
  `https://registry.npmjs.org/esbuild/-/esbuild-0.28.1.tgz`; integrity
  `sha512-HrJrvZv5ayxBzPfwphOoNzkzOIIlifzk0KJrGK2c8R4+LKpMtpYLQeUdjnwjWv/LZlkH2laZk+4w78pi99D4Vw==`.
- `@esbuild/darwin-arm64@0.28.1`: registry artifact
  `https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.1.tgz`;
  integrity
  `sha512-TZbWkQY7kvTAXbXUT7uVACR5cMHsDiSz9z7ZKAX/RTq/WJEk3QyRr0wZpNhBDX+/0CtdqUIJlOiodQcta6tY3Q==`.

The renderer packages are declared for the future backend seam. The current
entry point does not import them. TypeScript and esbuild are build tools only.
The current testable-core bundle contains no third-party runtime code, model,
animation, texture, font, sound, decoder binary, or WebAssembly asset.

The v2 manifest records the inputs and outputs of its generated checkpoint.
It uses a deterministic contract hash instead of an impossible manifest
self-hash. Source changes require regeneration before bundle consistency can
be claimed.

This record proves direct pinning and lock integrity only. It is not a full
transitive SBOM, license review, emitted-code notice audit, or asset-rights
closure. A08 must complete those reviews before third-party runtime code ships.

## Contributions and borrowed work

Before third-party source or assets enter Miller Avatar, record:

- the upstream project or asset and canonical source URL.
- the exact version, tag, commit, or immutable asset revision.
- the license and copyright notices.
- which files or assets were incorporated.
- whether the material was copied, adapted, bundled, or used only as a
  reference.
- the modifications made in Miller Avatar.
- relevant transitive dependencies and distribution requirements.
- cryptographic hashes for every distributed model, animation, texture, font,
  sound, or other binary asset.

Preserve all notices required by the upstream license in
`THIRD_PARTY_NOTICES.md` or the applicable distributed artifact.

## Dependency and asset review

Review renderer source, transitive packages, downloaded or bundled native
binaries, avatar models, animation clips, textures, shaders, fonts, sounds,
artwork, and example packs separately. A permissive repository or renderer
license does not establish that every distributed asset is safe to use.

Miller Avatar must not incorporate copyleft, noncommercial, source-available,
field-of-use-restricted, or unknown-license source code or assets.

User-supplied assets are not covered by Miller Avatar's Apache-2.0 license.
Miller Avatar must represent their provenance and validation status honestly
and must not imply redistribution permission.

## Clean-room boundary

Cortana Assistant and its private avatar may inform behavioral requirements
and performance stress tests, but their implementation and assets must not be
copied into Miller Avatar without a separate file-level authorship and
provenance review.
